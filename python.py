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
            senha = ''.join(random.choices(string.ascii_letters + string.digits + "!@#$%_&", k=14))
            print(Fore.GREEN + f"Senha forte gerada: {senha}" + Style.RESET_ALL)
            
        elif op == "4":
            export_to_js(topics)
        elif op == "0":
            print(Fore.CYAN + "Até mais! 👋" + Style.RESET_ALL)
            break
        else:
            print(Fore.RED + "Opção inválida!" + Style.RESET_ALL)

def export_to_js(topics):
    js_content = "// ==================== DADOS DOS TÓPICOS SECRETOS ====================\n"
    js_content += "const secretTopics = {\n"
    
    for key, data in topics.items():
        js_content += f'    "{key}": {{\n'
        js_content += f'        title: "{data["title"]}",\n'
        js_content += f'        password: "{data["password"]}",\n'
        js_content += f'        content: `{data["content"]}`\n'
        js_content += "    },\n"
    
    js_content += "};\n"
    
    with open("script_export.js", "w", encoding="utf-8") as f:
        f.write(js_content)
    print(Fore.GREEN + "✅ Exportado com sucesso para script_export.js!" + Style.RESET_ALL)

if __name__ == "__main__":
    menu()
