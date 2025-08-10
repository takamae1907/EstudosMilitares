document.addEventListener('DOMContentLoaded', () => {

    // --- Seletores de Elementos ---
    const audioPlayer = document.getElementById('audio-player');
    const songTitleDisplay = document.getElementById('current-song-title');
    const playlistElement = document.getElementById('playlist');
    const uploadInput = document.getElementById('upload-input');
    
    const youtubeSearchInput = document.getElementById('Youtube-input');
    const youtubeSearchBtn = document.getElementById('Youtube-btn');
    const youtubeResults = document.getElementById('youtube-results');

    // --- Variáveis de Estado ---
    let localPlaylist = [];
    let currentSongIndex = -1;

    // --- Lógica do Player Local ---

    // Lida com a seleção de arquivos
    uploadInput.addEventListener('change', (event) => {
        const files = event.target.files;
        if (files.length > 0) {
            for (const file of files) {
                localPlaylist.push(file);
                addSongToPlaylistDOM(file, localPlaylist.length - 1);
            }
        }
        // Limpa o input para permitir o upload do mesmo arquivo novamente
        uploadInput.value = ''; 
    });

    // Adiciona uma música na lista do HTML
    function addSongToPlaylistDOM(file, index) {
        const li = document.createElement('li');
        li.textContent = file.name.replace(/\.mp3/i, ''); // Remove a extensão para um nome mais limpo
        li.dataset.index = index; // Guarda o índice do arquivo no array

        li.addEventListener('click', () => {
            playSong(index);
        });

        playlistElement.appendChild(li);
    }
    
    // Toca a música do índice fornecido
    function playSong(index) {
        if (index < 0 || index >= localPlaylist.length) return;

        currentSongIndex = index;
        const songFile = localPlaylist[index];
        const songURL = URL.createObjectURL(songFile);
        
        audioPlayer.src = songURL;
        audioPlayer.play();
        songTitleDisplay.textContent = songFile.name;

        // Atualiza a classe 'active' na playlist
        updateActiveSongInPlaylist();
    }
    
    // Destaca a música que está tocando na lista
    function updateActiveSongInPlaylist() {
        const listItems = playlistElement.querySelectorAll('li');
        listItems.forEach(item => {
            if (parseInt(item.dataset.index) === currentSongIndex) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    // Toca a próxima música quando a atual terminar
    audioPlayer.addEventListener('ended', () => {
        const nextIndex = (currentSongIndex + 1) % localPlaylist.length;
        playSong(nextIndex);
    });


    // --- Lógica da Busca no YouTube (Placeholder) ---
    youtubeSearchBtn.addEventListener('click', () => {
        const query = youtubeSearchInput.value.trim();
        if (!query) {
            alert("Por favor, digite o nome de uma música ou artista.");
            return;
        }

        // Simulação de busca
        youtubeResults.innerHTML = `<p>Pesquisando por "<strong>${query}</strong>"...</p>
                                    <p style="margin-top:10px;">(Esta é uma demonstração. A integração real requer uma chave de API do YouTube para exibir resultados de busca e permitir a reprodução.)</p>`;

        // Em uma implementação real, aqui você faria a chamada para a API do YouTube
        // e preencheria a div 'youtube-results' com os vídeos encontrados.
        // Ex: fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&key=SUA_API_KEY`)
    });

});