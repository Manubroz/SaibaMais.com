from cryptography.fernet import Fernet
import json
import os
from colorama import init, Fore, Style

init()

# ==================== CONFIGURAÇÃO ====================
SECRET_FILE = "secret_topics.json"
KEY_FILE = "secret_key.key"

# ==================== GERAR CHAVE ====================
def generate_key():
    if not os.path.exists(KEY_FILE):
        key = Fernet.generate_key()
        with open(KEY_FILE, "wb") as f:
            f.write(key)
        print(Fore.GREEN + "✅ Nova chave de criptografia gerada!" + Style.RESET_ALL)
    else:
        print(Fore.YELLOW + "Chave já existe." + Style.RESET_ALL)

# ==================== CARREGAR DADOS ====================
def load_topics():
    generate_key()
    with open(KEY_FILE, "rb") as f:
        key = f.read()
    cipher = Fernet(key)
    
    if os.path.exists(SECRET_FILE):
        with open(SECRET_FILE, "rb") as f:
            encrypted = f.read()
        decrypted = cipher.decrypt(encrypted)
        return json.loads(decrypted)
    return {}

# ==================== SALVAR DADOS (criptografado) ====================
def save_topics(topics):
    with open(KEY_FILE, "rb") as f:
        key = f.read()
    cipher = Fernet(key)
    
    encrypted = cipher.encrypt(json.dumps(topics, indent=2, ensure_ascii=False).encode())
    with open(SECRET_FILE, "wb") as f:
        f.write(encrypted)
    print(Fore.GREEN + "✅ Tópicos salvos com segurança!" + Style.RESET_ALL)

# ==================== MENU ====================
def menu():
    topics = load_topics()
    
    while True:
        print("\n" + "="*50)
        print(Fore.CYAN + "   GERENCIADOR SAIBAMAIS" + Style.RESET_ALL)
        print("="*50)
        print("1. Adicionar novo tópico secreto")
        print("2. Listar tópicos")
        print("3. Gerar senha forte")
        print("4. Exportar para script.js")
        print("0. Sair")
        
        op = input("\nEscolha: ")
        
        if op == "1":
            titulo = input("Título do tópico: ")
            chave = input("Senha de acesso: ")
            conteudo = input("Conteúdo (pode usar HTML): ")
            key_name = titulo.lower().replace(" ", "")
            
            topics[key_name] = {
                "title": titulo,
                "password": chave,
                "content": conteudo
            }
            save_topics(topics)
            
        elif op == "2":
            print(Fore.YELLOW + "\nTópicos cadastrados:" + Style.RESET_ALL)
            for k, v in topics.items():
                print(f"• {k} → {v['title']}")
                
        elif op == "3":
            import random
            import string
            senha = ''.join(random.choices(string.ascii_letters + string.digits + "!@#$%", k=12))
            print(Fore.GREEN + f"Senha forte gerada: {senha}" + Style.RESET_ALL)
            
