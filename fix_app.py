import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# We need to find the block starting with "// App Master Data State" and ending before "const [buyRequests"
pattern = r"// App Master Data State.*?const \[buyRequests"
replacement = """// App Master Data State
  const [catalog, setCatalog] = useState<CatalogProduct[]>(SEED_CATALOG);

  useEffect(() => {
    fetchCatalogFromDB().then(dbCatalog => {
      if (dbCatalog && dbCatalog.length > 0) {
        setCatalog(dbCatalog);
      } else {
        const stored = localStorage.getItem('recellCatalog');
        if (stored) {
            setCatalog(JSON.parse(stored));
        }
      }
    });
  }, []);

  useEffect(() => {
    if (catalog !== SEED_CATALOG) {
      localStorage.setItem('recellCatalog', JSON.stringify(catalog));
      saveCatalogToDB(catalog);
    }
  }, [catalog]);

  const [buyRequests"""

new_content = re.sub(pattern, replacement, content, flags=re.DOTALL)

with open('src/App.tsx', 'w') as f:
    f.write(new_content)
