/**
 * SISTEMA DE COMANDO E CONTROLE - FAB v4.1
 * MONITORAMENTO DE CAMADA DE TRANSPORTE (TCP)
 */

async function fetchData(file, elementId) {
    const display = document.getElementById(elementId);
    
    // Feedback de rádio/radar
    display.innerHTML = `<span style="color: var(--alerta-amarelo)">📡 [SINTONIZANDO ENLACE TCP...]</span>`;
    
    // Timestamp para evitar cache e garantir nova conexão
    const url = file + '?t=' + new Date().getTime();

    try {
        if (file.endsWith('.jpg') || file.endsWith('.png')) {
            // Lógica para Imagens (Reconhecimento de Satélite)
            const img = new Image();
            img.style.maxWidth = "100%";
            img.style.border = "1px solid var(--verde-radar)";
            img.style.marginTop = "10px";
            
            img.onload = () => { 
                display.innerHTML = `<span style="color: var(--verde-radar)">🟢 RECONHECIMENTO VISUAL CONCLUÍDO</span><br>`; 
                display.appendChild(img); 
            };
            img.onerror = () => { 
                throw new Error("SINAL DE IMAGEM CORROMPIDO"); 
            };
            img.src = url;

        } else {
            // Lógica para Texto (Relatórios de Missão)
            const response = await fetch(url);
            
            if (!response.ok) throw new Error("ERRO DE AUTENTICAÇÃO/SERVER: " + response.status);
            
            const text = await response.text();

            // Exibe o status e o conteúdo real do arquivo
            display.innerHTML = `
                <div style="margin-bottom: 5px; border-bottom: 1px solid #333;">
                    <span style="color: var(--verde-radar)">🟢 DADOS RECEBIDOS [${text.length} BYTES]</span>
                </div>
                <pre style="white-space: pre-wrap; word-wrap: break-word; color: #a0ffbe; font-family: 'Courier New', monospace;">${text}</pre>
            `;
        }
    } catch (err) {
        // Alerta de falha na missão
        console.error("DEBUG_INFO:", err);
        display.innerHTML = `
            <span style="color: #ff4444;">❌ FALHA NO ENLACE TÁTICO</span><br>
            <small style="font-size: 0.7rem;">MOTIVO: ${err.message}</small>
        `;
    }
}