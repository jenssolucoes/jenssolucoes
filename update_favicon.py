import os

files_to_update = []
for root, dirs, files in os.walk(r"g:\Meu Drive\JENS Soluções - Website"):
    for file in files:
        if file.endswith(".html"):
            files_to_update.append(os.path.join(root, file))

for filepath in files_to_update:
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Substitui a referencia /favicon.svg por /assets/images/favicon.svg
    content = content.replace('<link rel="icon" href="/favicon.svg" type="image/svg+xml" />', '<link rel="icon" href="/assets/images/favicon.svg" type="image/svg+xml" />')
    
    # Remove a referencia ao favicon.png que não existe mais
    content = content.replace('    <link rel="icon" type="image/png" href="/favicon.png" />\n', '')
    content = content.replace('<link rel="icon" type="image/png" href="/favicon.png" />', '')
    
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)

print("Done")
