import React, { useState, useEffect } from 'react';
import {
  googleDriveSignIn,
  fetchDriveFiles,
  parseDriveFileToCatalogProduct,
  rehostDriveFileImage,
  DriveItem,
  getCachedDriveAccessToken,
  logoutGoogleDrive
} from '../lib/googleDriveService';
import { CatalogProduct } from '../types';
import { PRODUCT_IMAGE_FALLBACK } from '../utils/productImageFallback';
import { 
  Folder, 
  Image as ImageIcon, 
  CheckCircle, 
  ArrowLeft, 
  RefreshCw, 
  Sparkles, 
  ShieldCheck, 
  Upload, 
  Cloud, 
  LogOut,
  AlertCircle
} from 'lucide-react';

interface GoogleDriveImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportProducts: (products: CatalogProduct[]) => void;
}

export const GoogleDriveImportModal: React.FC<GoogleDriveImportModalProps> = ({
  isOpen,
  onClose,
  onImportProducts
}) => {
  const [user, setUser] = useState<any>(null);
  const [accessToken, setAccessToken] = useState<string | null>(getCachedDriveAccessToken());
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [currentFolderId, setCurrentFolderId] = useState<string | undefined>(undefined);
  const [folderHistory, setFolderHistory] = useState<{ id?: string; name: string; description?: string }[]>([
    { name: 'My Drive Root' }
  ]);

  const [files, setFiles] = useState<DriveItem[]>([]);
  const [folders, setFolders] = useState<DriveItem[]>([]);
  const [selectedFileIds, setSelectedFileIds] = useState<Set<string>>(new Set());
  const [isSharedWithMe, setIsSharedWithMe] = useState(false);

  const [parsedPreviewMap, setParsedPreviewMap] = useState<Record<string, CatalogProduct>>({});
  const [publishing, setPublishing] = useState(false);
  const [publishProgress, setPublishProgress] = useState<{ done: number; total: number } | null>(null);

  if (!isOpen) return null;

  // Re-hosts each Drive file's photo into Firebase Storage (see
  // rehostDriveFileImage's doc comment for why this matters - the Drive
  // thumbnail link used for the browser preview above is not durable
  // enough to publish). A file that fails to re-host (permissions changed,
  // deleted, network hiccup) falls back to the shared placeholder instead
  // of silently keeping the fragile Drive link, so a real problem shows up
  // as an honest "no photo yet" rather than a listing that works today and
  // breaks in a few hours.
  const rehostImages = async (driveFiles: DriveItem[]): Promise<Record<string, string>> => {
    if (!accessToken) return {};
    const result: Record<string, string> = {};
    setPublishProgress({ done: 0, total: driveFiles.length });
    for (let i = 0; i < driveFiles.length; i++) {
      const f = driveFiles[i];
      try {
        result[f.id] = await rehostDriveFileImage(f, accessToken);
      } catch (err) {
        console.error(`Failed to re-host Drive image "${f.name}":`, err);
        result[f.id] = PRODUCT_IMAGE_FALLBACK;
      }
      setPublishProgress({ done: i + 1, total: driveFiles.length });
    }
    return result;
  };

  const handleSignIn = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await googleDriveSignIn();
      setUser(res.user);
      setAccessToken(res.accessToken);
      await loadDriveDirectory(res.accessToken, currentFolderId, false, undefined);
    } catch (err: any) {
      console.error('Google Drive sign in error:', err);
      setErrorMsg(err.message || 'Failed to authenticate with Google Drive.');
    } finally {
      setLoading(false);
    }
  };

  const loadDriveDirectory = async (token: string, folderId?: string, shared: boolean = isSharedWithMe, folderDesc?: string, folderName?: string) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const { files: driveFiles, folders: driveFolders } = await fetchDriveFiles(token, folderId, shared);
      
      // Filter for images or media files
      const imageFiles = driveFiles.filter(f => 
        f.mimeType.startsWith('image/') || 
        f.mimeType.includes('pdf') || 
        f.mimeType.includes('document') ||
        f.mimeType.includes('text')
      );

      setFiles(imageFiles);
      setFolders(driveFolders);

      // Pre-parse items
      const newMap: Record<string, CatalogProduct> = {};
      imageFiles.forEach(f => {
        newMap[f.id] = parseDriveFileToCatalogProduct(f, token, folderDesc, folderName);
      });
      setParsedPreviewMap(newMap);

      // Auto select all image files
      const allIds = new Set(imageFiles.map(f => f.id));
      setSelectedFileIds(allIds);

    } catch (err: any) {
      console.error('Error fetching drive files:', err);
      setErrorMsg(err.message || 'Error listing Google Drive files.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenFolder = (folder: DriveItem) => {
    setCurrentFolderId(folder.id);
    setFolderHistory(prev => [...prev, { id: folder.id, name: folder.name, description: folder.description }]);
    if (accessToken) {
      loadDriveDirectory(accessToken, folder.id, isSharedWithMe, folder.description, folder.name);
    }
  };

  const handleNavigateBack = (index: number) => {
    const targetHistory = folderHistory.slice(0, index + 1);
    const targetFolder = targetHistory[targetHistory.length - 1];
    setFolderHistory(targetHistory);
    setCurrentFolderId(targetFolder.id);
    if (accessToken) {
      loadDriveDirectory(accessToken, targetFolder.id, isSharedWithMe, targetFolder.description, targetFolder.name);
    }
  };

  const toggleSelectFile = (id: string) => {
    const next = new Set(selectedFileIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedFileIds(next);
  };

  const toggleSelectAll = () => {
    if (selectedFileIds.size === files.length) {
      setSelectedFileIds(new Set());
    } else {
      setSelectedFileIds(new Set(files.map(f => f.id)));
    }
  };

  const handleImportToCatalog = async () => {
    const selectedFiles = files.filter(f => selectedFileIds.has(f.id));
    if (selectedFiles.length === 0) {
      alert('Please select at least 1 image file from Google Drive to import.');
      return;
    }

    setPublishing(true);
    try {
      const hostedUrls = await rehostImages(selectedFiles);
      const itemsToImport: CatalogProduct[] = selectedFiles
        .filter(f => parsedPreviewMap[f.id])
        .map(f => ({
          ...parsedPreviewMap[f.id],
          images: [hostedUrls[f.id] || PRODUCT_IMAGE_FALLBACK]
        }));

      onImportProducts(itemsToImport);
      onClose();
    } finally {
      setPublishing(false);
      setPublishProgress(null);
    }
  };

  const handleCombineSelectedIntoSingleProduct = async () => {
    const selectedFiles = files.filter(f => selectedFileIds.has(f.id));
    if (selectedFiles.length === 0) {
      alert('Please select at least 1 image file to combine.');
      return;
    }

    setPublishing(true);
    try {
      const hostedUrls = await rehostImages(selectedFiles);
      const itemsToCombine = selectedFiles
        .filter(f => parsedPreviewMap[f.id])
        .map(f => parsedPreviewMap[f.id]);
      const firstItem = itemsToCombine[0];
      const allImages = selectedFiles
        .map(f => hostedUrls[f.id])
        .filter((u): u is string => !!u && u !== PRODUCT_IMAGE_FALLBACK);

      // Get current folder name if inside a subfolder
      const currentFolderName = folderHistory.length > 1 ? folderHistory[folderHistory.length - 1].name : firstItem.model;

      const combinedProduct: CatalogProduct = {
        ...firstItem,
        id: `gdrive-combined-${Date.now()}`,
        title: folderHistory.length > 1 ? `${currentFolderName} [${firstItem.conditionGrade}]` : firstItem.title,
        images: allImages.length > 0 ? allImages : [PRODUCT_IMAGE_FALLBACK]
      };

      onImportProducts([combinedProduct]);
      onClose();
    } finally {
      setPublishing(false);
      setPublishProgress(null);
    }
  };

  const handlePublishFolderAsDevice = async (folder: DriveItem) => {
    if (!accessToken) return;
    setLoading(true);
    try {
      const { files: driveFiles } = await fetchDriveFiles(accessToken, folder.id, isSharedWithMe);
      const imageFiles = driveFiles.filter(f =>
        f.mimeType.startsWith('image/') ||
        f.mimeType.includes('pdf') ||
        f.mimeType.includes('document') ||
        f.mimeType.includes('text')
      );

      if (imageFiles.length === 0) {
        alert(`Folder "${folder.name}" has no images to publish.`);
        setLoading(false);
        return;
      }

      const firstItem = parseDriveFileToCatalogProduct(imageFiles[0], accessToken, folder.description, folder.name);

      setLoading(false);
      setPublishing(true);
      const hostedUrls = await rehostImages(imageFiles);
      const allImages = imageFiles
        .map(f => hostedUrls[f.id])
        .filter((u): u is string => !!u && u !== PRODUCT_IMAGE_FALLBACK);

      const combinedProduct: CatalogProduct = {
        ...firstItem,
        id: `gdrive-folder-${folder.id}`,
        title: `${folder.name} [${firstItem.conditionGrade}]`,
        images: allImages.length > 0 ? allImages : [PRODUCT_IMAGE_FALLBACK]
      };

      onImportProducts([combinedProduct]);
      alert(`Successfully published folder "${folder.name}" as 1 device with ${allImages.length} photos!`);
    } catch (err) {
      console.error('Error publishing folder:', err);
      alert('Failed to publish folder.');
    } finally {
      setLoading(false);
      setPublishing(false);
      setPublishProgress(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-slate-900 text-xs">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0052FF]">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 font-heading flex items-center gap-2">
                <span>Google Drive Direct Photo &amp; Inventory Importer</span>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-md uppercase">
                  Live OAuth
                </span>
              </h3>
              <p className="text-[11px] text-slate-500">
                Directly sync mobile photos, descriptions, and grades from your Google Drive
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {accessToken && (
              <button
                type="button"
                onClick={() => {
                  logoutGoogleDrive();
                  setAccessToken(null);
                  setUser(null);
                }}
                className="text-slate-500 hover:text-slate-800 text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Disconnect</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 flex-1 overflow-y-auto space-y-5">

          {errorMsg && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2 font-bold">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* If NOT Authenticated: Show Google Sign-In Prompt */}
          {!accessToken ? (
            <div className="py-12 px-6 text-center max-w-md mx-auto space-y-6">
              <div className="w-16 h-16 rounded-3xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0052FF] mx-auto shadow-sm">
                <Cloud className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h4 className="text-lg font-bold text-slate-900 font-heading">
                  Connect your Google Drive Account
                </h4>
                <p className="text-slate-500 text-xs leading-relaxed">
                  Sign in with Google to grant ReCell permission to read mobile phone photos and descriptions stored in your Drive folders.
                </p>
              </div>

              {/* Official Google Material Sign-In Button */}
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={handleSignIn}
                  disabled={loading}
                  className="gsi-material-button hover:shadow-md transition-all cursor-pointer bg-white border border-slate-300 rounded-full px-6 py-3 flex items-center gap-3 text-slate-700 font-bold text-sm"
                  style={{
                    backgroundColor: '#ffffff',
                    color: '#1f2937',
                    borderColor: '#e5e7eb'
                  }}
                >
                  <div className="w-5 h-5 shrink-0">
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" style={{ display: 'block' }}>
                      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                    </svg>
                  </div>
                  <span>{loading ? 'Authenticating with Google...' : 'Sign in with Google Drive'}</span>
                </button>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-[11px] text-slate-500 text-left space-y-1">
                <p className="font-bold text-slate-700 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Grade Auto-Classification Rules:
                </p>
                <p>• Files containing "Grade A" or "Service Warranty" → <strong>Grade A</strong></p>
                <p>• Files containing "Grade A1" or "New" → <strong>Grade A1</strong></p>
                <p>• Files containing "Grade B" or "Scuffs" → <strong>Grade B</strong></p>
                <p>• Files containing "Grade B1" or "Repaired" → <strong>Grade B1</strong></p>
              </div>
            </div>
          ) : (
            /* Authenticated Drive Directory Browser */
            <div className="space-y-4">
              
              {/* Drive Source Tabs */}
              <div className="flex p-1 bg-slate-100 rounded-xl w-fit">
                <button
                  type="button"
                  onClick={() => {
                    if (isSharedWithMe) {
                      setIsSharedWithMe(false);
                      setFolderHistory([{ name: 'My Drive Root' }]);
                      setCurrentFolderId(undefined);
                      if (accessToken) loadDriveDirectory(accessToken, undefined, false);
                    }
                  }}
                  className={`px-4 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${!isSharedWithMe ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  My Drive
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!isSharedWithMe) {
                      setIsSharedWithMe(true);
                      setFolderHistory([{ name: 'Shared with me' }]);
                      setCurrentFolderId(undefined);
                      if (accessToken) loadDriveDirectory(accessToken, undefined, true);
                    }
                  }}
                  className={`px-4 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${isSharedWithMe ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Shared with me
                </button>
              </div>

              {/* Breadcrumbs Navigation */}
              <div className="flex items-center justify-between bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium overflow-x-auto">
                  {folderHistory.map((folder, idx) => (
                    <React.Fragment key={folder.id || 'root'}>
                      {idx > 0 && <span className="text-slate-300">/</span>}
                      <button
                        type="button"
                        onClick={() => handleNavigateBack(idx)}
                        className={`hover:underline cursor-pointer ${idx === folderHistory.length - 1 ? 'font-bold text-[#0052FF]' : ''}`}
                      >
                        {folder.name}
                      </button>
                    </React.Fragment>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => accessToken && loadDriveDirectory(accessToken, currentFolderId)}
                  className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                  title="Refresh Drive Files"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                </button>
              </div>

              {loading ? (
                <div className="py-16 text-center space-y-3">
                  <RefreshCw className="w-8 h-8 text-[#0052FF] animate-spin mx-auto" />
                  <p className="font-bold text-slate-700 text-xs font-heading">Scanning Google Drive files &amp; photos...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  
                  {/* Folders Section */}
                  {folders.length > 0 && (
                    <div>
                      <h4 className="text-[11px] uppercase tracking-wider font-bold text-slate-400 mb-2">Folders ({folders.length})</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                        {folders.map(f => (
                          <div
                            key={f.id}
                            className="p-3 bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 rounded-2xl flex flex-col gap-2.5 transition-all group"
                          >
                            <button
                              type="button"
                              onClick={() => handleOpenFolder(f)}
                              className="flex items-center gap-2.5 text-left cursor-pointer flex-1 w-full"
                            >
                              <Folder className="w-4 h-4 text-amber-500 shrink-0 group-hover:scale-110 transition-transform" />
                              <span className="font-bold text-slate-800 text-xs truncate">{f.name}</span>
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePublishFolderAsDevice(f);
                              }}
                              disabled={publishing || loading}
                              className="w-full mt-auto bg-indigo-50 hover:bg-indigo-600 hover:text-white text-indigo-700 text-[10px] font-bold py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-40 disabled:pointer-events-none"
                            >
                              <Upload className="w-3 h-3" /> Publish Folder
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Files / Mobile Photos Section */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-[11px] uppercase tracking-wider font-bold text-slate-400">
                        Mobile Phone Photos &amp; Specs ({files.length})
                      </h4>

                      {files.length > 0 && (
                        <button
                          type="button"
                          onClick={toggleSelectAll}
                          className="text-[#0052FF] font-bold text-xs hover:underline cursor-pointer"
                        >
                          {selectedFileIds.size === files.length ? 'Deselect All' : 'Select All Files'}
                        </button>
                      )}
                    </div>

                    {files.length === 0 ? (
                      <div className="py-12 bg-slate-50 border border-dashed border-slate-200 rounded-2xl text-center space-y-2">
                        <ImageIcon className="w-8 h-8 text-slate-300 mx-auto" />
                        <p className="font-bold text-slate-700">No photos or files found in this folder</p>
                        <p className="text-[11px] text-slate-400">Upload your mobile phone images to Google Drive and refresh!</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {files.map(f => {
                          const isSelected = selectedFileIds.has(f.id);
                          const parsed = parsedPreviewMap[f.id];

                          return (
                            <div
                              key={f.id}
                              onClick={() => toggleSelectFile(f.id)}
                              className={`p-3 rounded-2xl border transition-all cursor-pointer space-y-2 relative flex flex-col justify-between ${
                                isSelected 
                                  ? 'bg-blue-50/60 border-[#0052FF] ring-2 ring-[#0052FF]/20 shadow-sm' 
                                  : 'bg-white border-slate-200 hover:border-slate-300'
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex items-center gap-2 overflow-hidden">
                                  <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
                                    {f.thumbnailLink ? (
                                      <img src={f.thumbnailLink} alt={f.name} className="w-full h-full object-cover" />
                                    ) : (
                                      <ImageIcon className="w-5 h-5 text-slate-400" />
                                    )}
                                  </div>

                                  <div className="overflow-hidden">
                                    <p className="font-bold text-slate-900 truncate text-xs">{f.name}</p>
                                    <span className={`inline-block text-[10px] font-black px-2 py-0.5 rounded-md font-heading ${
                                      parsed?.conditionGrade === 'Grade A'
                                        ? 'bg-emerald-100 text-emerald-800'
                                        : parsed?.conditionGrade === 'Grade A1'
                                        ? 'bg-blue-100 text-blue-800'
                                        : parsed?.conditionGrade === 'Grade B'
                                        ? 'bg-amber-100 text-amber-800'
                                        : parsed?.conditionGrade === 'Grade B1'
                                        ? 'bg-purple-100 text-purple-800'
                                        : 'bg-slate-100 text-slate-800'
                                    }`}>
                                      {parsed?.conditionGrade || 'Grade A1'}
                                    </span>
                                  </div>
                                </div>

                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => {}} // Handled by parent div
                                  className="w-4 h-4 text-[#0052FF] rounded border-slate-300 focus:ring-[#0052FF] shrink-0 mt-1 cursor-pointer"
                                />
                              </div>

                              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600 font-medium">
                                <span>Estimated Price:</span>
                                <span className="font-black text-slate-900 font-heading">₹{parsed?.refurbPrice.toLocaleString('en-IN')}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                </div>
              )}

            </div>
          )}

        </div>

        {/* Modal Footer */}
        {accessToken && (
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-slate-600 font-medium text-xs">
              {publishing ? (
                <span className="flex items-center gap-2 text-[#0052FF] font-bold">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Saving photos to Recell storage{publishProgress ? ` (${publishProgress.done}/${publishProgress.total})` : '...'}
                </span>
              ) : (
                <>Selected <strong className="text-slate-900 font-bold">{selectedFileIds.size}</strong> device photos to import</>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                disabled={publishing}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-100 disabled:opacity-40 transition-all cursor-pointer"
              >
                Cancel
              </button>

              {selectedFileIds.size > 1 && (
                <button
                  type="button"
                  onClick={handleCombineSelectedIntoSingleProduct}
                  disabled={publishing}
                  className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer font-heading"
                  title="Combine all selected photos into 1 mobile listing with gallery"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Combine All {selectedFileIds.size} Photos into 1 Device</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleImportToCatalog}
                disabled={selectedFileIds.size === 0 || publishing}
                className="bg-[#0052FF] hover:bg-[#0043CC] disabled:opacity-40 text-white font-bold px-6 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer font-heading"
              >
                <Upload className="w-4 h-4" />
                <span>Publish as {selectedFileIds.size} Listing{selectedFileIds.size > 1 ? 's' : ''}</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
