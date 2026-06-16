import requests

URL = "http://127.0.0.1:8000/produtos"

produtos_teste = [

    # --- GENÉRICOS ---
    { "nome": "Dipirona Monoidratada 500mg", "preco": 2.50, "categoria": "Medicamento", "estoque": 100, "imagem_url": "https://i.ibb.co/VYhhhVq0/18697373.webp", "subcategoria": "Genéricos" },
    { "nome": "Losartana Potássica 50mg", "preco": 2.50, "categoria": "Medicamento", "estoque": 150, "imagem_url": "https://i.ibb.co/JRTRhxQ1/158340-losartana-potassica-50mg-c-30cpr-p67181-m3-638319294126709090.webp", "subcategoria": "Genéricos" },
    { "nome": "Paracetamol 750mg", "preco": 2.50, "categoria": "Medicamento", "estoque": 200, "imagem_url": "https://i.ibb.co/twYzV1v3/paracetamol-prati-donaduzzi-750mg-blister-com-10-comprimidos-revestidos-35323.webp", "subcategoria": "Genéricos" },
    { "nome": "Omeprazol 20mg", "preco": 9.95, "categoria": "Medicamento", "estoque": 80, "imagem_url": "https://i.ibb.co/8ncGGy9N/omeprazol-20mg-com-56-capsulas-generico-geolab-17059.webp", "subcategoria": "Genéricos" },
    { "nome": "Nimesulida 100mg", "preco": 5.00, "categoria": "Medicamento", "estoque": 120, "imagem_url": "https://i.ibb.co/1G1VQJpn/45986-nimesulida-100-mg-c-12-cpr-globo-p37733-l1-638700461701870805.webp", "subcategoria": "Genéricos" },

    # --- DOR E FEBRE ---
    { "nome": "Dorflex 10 comprimidos", "preco": 6.50, "categoria": "Medicamento", "estoque": 50, "imagem_url": "https://i.ibb.co/JF0YXgYc/download-2.jpg", "subcategoria": "Dor e Febre" },
    { "nome": "Neosaldina 30 Drágeas", "preco": 25.00, "categoria": "Medicamento", "estoque": 80, "imagem_url": "https://i.ibb.co/67HtdcrG/download-3.jpg", "subcategoria": "Dor e Febre" },
    { "nome": "Advil 400mg 3 Cápsulas", "preco": 9.95, "categoria": "Medicamento", "estoque": 60, "imagem_url": "https://i.ibb.co/fd5dcQrW/download-5.jpg", "subcategoria": "Dor e Febre" },
    { "nome": "Novalgina 1g 10 Comprimidos", "preco": 19.95, "categoria": "Medicamento", "estoque": 90, "imagem_url": "https://i.ibb.co/n8kzKDST/download-4.jpg", "subcategoria": "Dor e Febre" },
    { "nome": "Tylenol 750mg 20 Comprimidos", "preco": 19.95, "categoria": "Medicamento", "estoque": 75, "imagem_url": "https://i.ibb.co/4wjG3hb9/download-6.jpg", "subcategoria": "Dor e Febre" },

    # --- GRIPE ---
    { "nome": "Xarope Vick 120ml", "preco": 24.95, "categoria": "Medicamento", "estoque": 40, "imagem_url": "https://i.ibb.co/xS1m9VMk/download-7.jpg", "subcategoria": "Gripe" },
    { "nome": "Benegrip 6 Comprimidos", "preco": 13.95, "categoria": "Medicamento", "estoque": 150, "imagem_url": "https://i.ibb.co/bMLyr1rH/download-8.jpg", "subcategoria": "Gripe" },
    { "nome": "Cimegripe 20 Cápsulas", "preco": 12.95, "categoria": "Medicamento", "estoque": 110, "imagem_url": "https://i.ibb.co/zTRKmyxD/download-9.jpg", "subcategoria": "Gripe" },
    { "nome": "Coristina D 4 Comprimidos", "preco": 9.95, "categoria": "Medicamento", "estoque": 200, "imagem_url": "https://i.ibb.co/V0FTL7bC/download-10.jpg", "subcategoria": "Gripe" },
    { "nome": "Strepsils Mel e Limão 16 Pastilhas", "preco": 19.95, "categoria": "Medicamento", "estoque": 35, "imagem_url": "https://i.ibb.co/99TL2XLd/download-11.jpg", "subcategoria": "Gripe" },

    # --- INFANTIL ---
    { "nome": "Fralda Pampers Confort Sec M", "preco": 45.90, "categoria": "Perfumaria", "estoque": 30, "imagem_url": "https://i.ibb.co/bg5nZMtG/shopping.webp", "subcategoria": "Infantil" },
    { "nome": "Pomada Bepantol Baby 30g", "preco": 24.90, "categoria": "Perfumaria", "estoque": 50, "imagem_url": "https://i.ibb.co/3yV0K0Kn/3786578.webp", "subcategoria": "Infantil" },
    { "nome": "Shampoo Johnson's Baby 200ml", "preco": 16.50, "categoria": "Perfumaria", "estoque": 80, "imagem_url": "https://i.ibb.co/My795r90/download-12.jpg", "subcategoria": "Infantil" },
    { "nome": "Toalhas Umedecidas Huggies 48 un", "preco": 11.90, "categoria": "Perfumaria", "estoque": 120, "imagem_url": "https://i.ibb.co/V0JFdNZp/download-14.jpg", "subcategoria": "Infantil" },
    { "nome": "Tylenol Bebê Suspensão 15ml", "preco": 32.50, "categoria": "Medicamento", "estoque": 40, "imagem_url": "https://i.ibb.co/KcBdkX55/download-15.jpg", "subcategoria": "Infantil" },

    # --- HIGIENE ---
    { "nome": "Sabonete Dove Branco 90g", "preco": 3.50, "categoria": "Perfumaria", "estoque": 120, "imagem_url": "https://i.ibb.co/1Gcj3Vqw/download-16.jpg", "subcategoria": "Higiene" },
    { "nome": "Desodorante Rexona Aerosol Men V8 150ml", "preco": 17.90, "categoria": "Perfumaria", "estoque": 90, "imagem_url": "https://i.ibb.co/LXj5JjJm/17195397.webp", "subcategoria": "Higiene" },
    { "nome": "Creme Dental Colgate Total 12 90g", "preco": 8.50, "categoria": "Perfumaria", "estoque": 150, "imagem_url": "https://i.ibb.co/Z1vdWV7f/download-17.jpg", "subcategoria": "Higiene" },
    { "nome": "Listerine Cool Mint 500ml", "preco": 26.90, "categoria": "Perfumaria", "estoque": 60, "imagem_url": "https://i.ibb.co/TMywmJcc/3674455.webp", "subcategoria": "Higiene" },
    { "nome": "Fio Dental Reach 50m", "preco": 9.90, "categoria": "Perfumaria", "estoque": 100, "imagem_url": "https://i.ibb.co/tT0SKjXf/23515-20260225-0.jpg", "subcategoria": "Higiene" },

    # --- SUPLEMENTOS ---
    { "nome": "Whey Protein WPC Vitafor 900g", "preco": 129.95, "categoria": "Suplemento", "estoque": 25, "imagem_url": "https://i.ibb.co/YTXjr2nM/3b407db9705ea3bcb8e24a02a7a3f0ca-372mmp1ubr.webp", "subcategoria": "Fitness" },
    { "nome": "Creatina Vitafor 300g", "preco": 89.90, "categoria": "Suplemento", "estoque": 40, "imagem_url": "https://i.ibb.co/1Y0cCLWD/download-18.jpg", "subcategoria": "Fitness" },
    { "nome": "Lavitan Polivitamínico A-Z 60 Drágeas", "preco": 29.90, "categoria": "Suplemento", "estoque": 70, "imagem_url": "https://i.ibb.co/kVjtJxPh/375152-lavitan-suplementos-60-drageas-jpg.webp", "subcategoria": "Vitaminas" },
    { "nome": "Targifor C + Arginina C/16", "preco": 49.95, "categoria": "Suplemento", "estoque": 55, "imagem_url": "https://i.ibb.co/gZYFjhxc/111298.webp", "subcategoria": "Vitaminas" }
]

print("Iniciando o cadastro de produtos em massa...\n")

produtos_cadastrados = 0

for produto in produtos_teste:
    try:
        resposta = requests.post(URL, json=produto)
        
        if resposta.status_code in [200, 201]:
            print(f"Sucesso: {produto['nome']}")
            produtos_cadastrados += 1
        else:
            print(f"Erro ao cadastrar {produto['nome']}: {resposta.text}")
            
    except requests.exceptions.ConnectionError:
        print("ERRO: Não foi possível conectar ao servidor FastAPI. Verifique se ele está rodando.")
        break

print(f"\nFinalizado! {produtos_cadastrados} produtos adicionados ao banco de dados.")