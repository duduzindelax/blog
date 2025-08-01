document.addEventListener('DOMContentLoaded', () => {
    // --- Funcionalidade para Menu de Navegação Responsivo ---
    const menuToggle = document.getElementById('menu-toggle');
    const mainNav = document.getElementById('main-nav');

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            const isExpanded = mainNav.classList.contains('active');
            menuToggle.setAttribute('aria-expanded', isExpanded);
        });
    }

    // --- Carregamento Dinâmico de Posts na Página Inicial (index.html) ---
    const postsContainer = document.getElementById('posts-container');

    if (postsContainer) {
        fetch('posts.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Erro ao carregar posts: ${response.status} ${response.statusText}`);
                }
                return response.json();
            })
            .then(posts => {
                posts.forEach(post => {
                    const postCard = document.createElement('article');
                    postCard.classList.add('post-card');
                    postCard.innerHTML = `
                        <h3><a href="posts/post.html?id=${post.id}">${post.title}</a></h3>
                        <p>${post.description}</p>
                        <small>Publicado em: ${post.date}</small>
                    `;
                    postsContainer.appendChild(postCard);
                });
            })
            .catch(error => {
                console.error('Falha ao carregar as publicações:', error);
                postsContainer.innerHTML = '<p>Não foi possível carregar as publicações no momento. Tente novamente mais tarde.</p>';
            });
    }

    // --- Exibição de Conteúdo de Post Individual (posts/post.html) ---
    const isPostPage = window.location.pathname.includes('post.html');

    if (isPostPage) {
        const params = new URLSearchParams(window.location.search);
        const postId = params.get('id');

        const postTitleTag = document.getElementById('post-title-tag');
        const postHeading = document.getElementById('post-heading');
        const postDate = document.getElementById('post-date');
        const postContent = document.getElementById('post-content');

        if (postId && postTitleTag && postHeading && postDate && postContent) {
            fetch('../posts.json')
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Erro ao carregar o post: ${response.status} ${response.statusText}`);
                    }
                    return response.json();
                })
                .then(posts => {
                    const post = posts.find(p => p.id === postId);
                    if (post) {
                        postTitleTag.textContent = `${post.title} - Blog do Dudu`;
                        postHeading.textContent = post.title;
                        postDate.textContent = `Publicado em: ${post.date}`;
                        postContent.innerHTML = post.content;
                    } else {
                        postTitleTag.textContent = 'Post Não Encontrado';
                        postHeading.textContent = 'Post Não Encontrado';
                        postContent.innerHTML = '<p>Desculpe, o post que você procura não existe.</p>';
                    }
                })
                .catch(error => {
                    console.error('Erro ao carregar o post:', error);
                    postTitleTag.textContent = 'Erro';
                    postHeading.textContent = 'Erro ao Carregar Post';
                    postContent.innerHTML = '<p>Ocorreu um erro ao carregar o conteúdo do post.</p>';
                });
        } else if (!postId) {
            postTitleTag.textContent = 'Post Não Especificado';
            postHeading.textContent = 'Nenhum Post Selecionado';
            postContent.innerHTML = '<p>Por favor, selecione um post para visualizar.</p>';
        }
    }

    // --- Rolagem Suave (Smooth Scrolling) para Links Internos ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            document.querySelector(targetId).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});
