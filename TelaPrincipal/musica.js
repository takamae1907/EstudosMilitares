document.addEventListener('DOMContentLoaded', () => {

    // --- Seletores de Elementos ---
    const audioPlayer = document.getElementById('audio-player');
    const songTitleDisplay = document.getElementById('current-song-title');
    const playlistElement = document.getElementById('playlist');
    const uploadInput = document.getElementById('upload-input');

    // CORREÇÃO: IDs no JS devem ser idênticos aos do HTML (letras minúsculas)
    const youtubeSearchInput = document.getElementById('youtube-input');
    const youtubeSearchBtn = document.getElementById('youtube-btn');
    const youtubeResults = document.getElementById('youtube-results');

    // --- Variáveis de Estado ---
    let localPlaylist = [];
    let currentSongIndex = -1;

    // --- Lógica do Player Local ---

    uploadInput.addEventListener('change', (event) => {
        const files = event.target.files;
        if (files.length > 0) {
            for (const file of files) {
                localPlaylist.push(file);
                addSongToPlaylistDOM(file, localPlaylist.length - 1);
            }
        }
        uploadInput.value = '';
    });

    function addSongToPlaylistDOM(file, index) {
        const li = document.createElement('li');
        li.textContent = file.name.replace(/\.(mp3|wav|ogg|m4a)$/i, '');
        li.dataset.index = index;

        li.addEventListener('click', () => {
            playSong(index);
        });

        playlistElement.appendChild(li);
    }

    function playSong(index) {
        if (index < 0 || index >= localPlaylist.length) return;

        currentSongIndex = index;
        const songFile = localPlaylist[index];
        const songURL = URL.createObjectURL(songFile);

        audioPlayer.src = songURL;
        audioPlayer.play();
        songTitleDisplay.textContent = songFile.name.replace(/\.(mp3|wav|ogg|m4a)$/i, '');

        updateActiveSongInPlaylist();
    }

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

    audioPlayer.addEventListener('ended', () => {
        // Se houver apenas uma música, para. Se houver mais, toca a próxima.
        if (localPlaylist.length > 1) {
            const nextIndex = (currentSongIndex + 1) % localPlaylist.length;
            playSong(nextIndex);
        }
    });

    // --- Lógica da Busca no YouTube (Placeholder) ---
    youtubeSearchBtn.addEventListener('click', () => {
        const query = youtubeSearchInput.value.trim();
        if (!query) {
            alert("Por favor, digite o nome de uma música ou artista.");
            return;
        }

        youtubeResults.innerHTML = `<p>Pesquisando por "<strong>${query}</strong>"...</p>
                                    <p style="margin-top:10px; font-size: 0.8em; line-height: 1.5;">(Esta é uma demonstração. A integração real requer uma chave de API do YouTube para exibir resultados de busca e permitir a reprodução.)</p>`;
    });

});