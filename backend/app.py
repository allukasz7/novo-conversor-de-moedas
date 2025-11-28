import os
from flask import Flask, request, jsonify
from flask_cors import CORS 
from google import genai
import logging

# Configuração básica de log para ver erros no terminal
logging.basicConfig(level=logging.INFO)

app = Flask(__name__)
# Permite chamadas do seu front-end (que estará rodando em outro "servidor" ou local)
CORS(app) 

# --- Inicialização do Cliente Gemini ---
api_key = os.getenv('GEMINI_API_KEY')
if not api_key:
    logging.error("Variável de ambiente GEMINI_API_KEY não configurada. O servidor não funcionará.")
    # Você deve parar o servidor aqui em produção, mas vamos deixar rodar para testes
    # exit() 

client = genai.Client(api_key=api_key)
# ---------------------------------------

@app.route('/api/explicar', methods=['POST'])
def explicar_moedas():
    # 1. Recebe os dados do JavaScript
    data = request.json
    moeda_origem = data.get('origem', 'Moeda X')
    moeda_destino = data.get('destino', 'Moeda Y')
    
    # 2. Monta o Prompt
    prompt_text = (
        f"Explique de forma simples e interessante o que são as moedas '{moeda_origem}' e "
        f"'{moeda_destino}' e qual fator afeta a taxa de câmbio entre elas. "
        f"Mantenha a resposta concisa em português. Inclua emojis."
    )
    
    try:
        # TENTATIVA 1: Chamada ao LLM Gemini
        logging.info("Tentativa 1: Chamando Gemini...")
        response = client.models.generate_content(
            model='gemini-2.5-flash', 
            contents=prompt_text
        )
        
        # Sucesso! Retorna a resposta
        return jsonify({
            'explicacao': response.text
        })
    
    except Exception as e:
        # Se a primeira tentativa falhar (Gemini off, chave inválida, etc.)
        logging.error(f"Erro na Tentativa 1 (Gemini): {e}. Iniciando Fallback...")
        
        # --- FALLBACK SIMPLES ---
        # Como não temos uma segunda API configurada, simularemos um fallback 
        # para mostrar que o conceito foi implementado no fluxo de erro.
        
        # Em um cenário real, você faria aqui uma chamada para a API do ChatGPT/Claude
        # TENTATIVA 2: Simulação de Fallback
        
        fallback_msg = (
            f"⚠️ **[Fallback Ativo]** Desculpe, o nosso serviço principal de IA ({os.getenv('GEMINI_MODEL', 'Gemini')}) "
            f"está temporariamente indisponível. A taxa de câmbio entre {moeda_origem} e {moeda_destino} "
            f"é afetada principalmente por fatores como a política de juros de seus respectivos bancos centrais."
        )
        
        return jsonify({
            'explicacao': fallback_msg,
            'status': 'fallback_simulado'
        }), 200 # Retornamos 200 (OK) para o front-end exibir a mensagem tratada

if __name__ == '__main__':
    # Inicia o servidor Python na porta 5000
    print("Servidor Flask rodando em http://127.0.0.1:5000/")
    app.run(port=5000)

