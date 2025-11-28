const convertButton = document.querySelector(".convert-button")
const selectCurrency = document.querySelector(".select-currency")

function convertCurrency() {
    const inputCurrencyValue = document.querySelector(".input-currency").value
    const currencyValueToConvert = document.querySelector(".currency-value-to-convert")
    const currencyValueConverted = document.querySelector(".currency-value")

    console.log(selectCurrency.value)
    const dolarToday = 5.58
    const euroToday = 6.49

    // Atualiza o valor em Real (moeda de origem)
    if (inputCurrencyValue) {
        currencyValueToConvert.innerHTML = new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL"
        }).format(inputCurrencyValue)
    } else {
        currencyValueToConvert.innerHTML = "R$ 0,00"
    }

    // Converte para a moeda selecionada
    if (selectCurrency.value == "Dólar Americano") { //se o valor selecionado for dolar
        currencyValueConverted.innerHTML = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD"
        }).format(inputCurrencyValue / dolarToday)
    }

    if (selectCurrency.value == "Euro") { //se o valor selecionado for euro
        currencyValueConverted.innerHTML = new Intl.NumberFormat("de-DE", {
            style: "currency",
            currency: "EUR"
        }).format(inputCurrencyValue / euroToday)
    }
}

// ========== FUNÇÃO DE EXPLICAÇÃO COM IA ==========
async function getExplanation() {
    // 1. Coleta os valores do HTML
    const moedaOrigem = document.getElementById('currency-from').value; 
    const moedaDestino = document.getElementById('currency-to').value;   

    const aiExplanationDiv = document.getElementById('aiExplanation');
    aiExplanationDiv.innerHTML = '🤖 Gerando explicação com IA... (aguarde)';
    aiExplanationDiv.style.display = 'block';

    const urlServidor = 'http://127.0.0.1:5000/api/explicar';

    try {
        // 2. Chama o servidor Python local
        const response = await fetch(urlServidor, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            // 3. Envia as moedas para o Python
            body: JSON.stringify({
                origem: moedaOrigem,
                destino: moedaDestino
            })
        });

        const data = await response.json();
        
        // 4. Tratamento da Resposta
        if (response.ok) {
            // Se o status for 200 (OK)
            aiExplanationDiv.innerHTML = data.explicacao; 
        } else {
            // Se o status for 500 (Erro no servidor)
            console.error("Erro do servidor:", data.erro);
            aiExplanationDiv.innerHTML = `❌ Erro: ${data.erro || 'Não foi possível comunicar com o servidor de IA.'}`;
        }

    } catch (error) {
        // Erro de rede (servidor Python está desligado)
        console.error("Erro de rede ao chamar o servidor Python:", error);
        aiExplanationDiv.innerHTML = "🔴 Erro de Conexão: Verifique se o servidor Python está ativo.";
    }
}

function changeCurrency(){
  const currencyName = document.getElementById("currency-name")
  const currencyImage = document.querySelector(".currency-img")
if (selectCurrency.value == "Dólar Americano") { //se o valor selecionado for dolar
    currencyName.innerHTML = "Dólar americano"
    currencyImage.src = "./assets/dolar.png"
  } 

if (selectCurrency.value == "Euro") { //se o valor selecionado for euro
    currencyName.innerHTML = "Euro"
    currencyImage.src = "./assets/euro.png"
  } 

convertCurrency() //chama a função para atualizar o valor convertido
 
}


selectCurrency.addEventListener("change", changeCurrency)
convertButton.addEventListener("click", convertCurrency)







