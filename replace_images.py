import os

files_to_update = []
for root, dirs, files in os.walk(r"g:\Meu Drive\JENS Soluções - Website"):
    for file in files:
        if file.endswith(".html"):
            files_to_update.append(os.path.join(root, file))

for filepath in files_to_update:
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
    
    content = content.replace("https://jenssolucoes.com.br/assets/images/og-image.jpg", "https://jenssolucoes.com.br/assets/images/logotipo-2.svg")
    content = content.replace('"image": "https://jenssolucoes.com.br/assets/images/logotipo.svg"', '"image": "https://jenssolucoes.com.br/assets/images/logotipo-2.svg"')
    content = content.replace('"url": "https://jenssolucoes.com.br/assets/images/logotipo.svg"', '"url": "https://jenssolucoes.com.br/assets/images/logotipo-2.svg"')
    
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)

print("Done")
