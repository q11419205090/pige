// 图片数据
const slidesData = [
    {
        quote: "不可能这三个字你说的太多了",
        source: "动漫《星游记》",
        speed: 150  // 默认速度
    },
    {
        quote: "即使再可怕的困境，也只有冲上去才能解决",
        source: "动漫《星游记》",
        speed: 150  // 默认速度
    },
    {
        quote: "人类就是靠不断冒险才能一直生存到今天的，可惜这种本能只被很少的人继承了吧",
        source: "动漫《星游记》",
        speed: 150  // 默认速度
    },
    {
        quote: "让你害怕的水也能带来漂亮的彩虹，所有人都会有害怕的东西，但是感到恐惧就躲起来，世界就会变得越来越小，第一道闪电，第一束火苗，让人类进步的所有事情都是由恐惧开始的，把最恐怖的地方变成最美丽的景色，这才是男人的梦想",
        source: "动漫《星游记》",
        speed: 75  // 加快2倍速度（150/2=75）
    }
];

let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;
const slideDuration = 8000; // 8秒切换一次
let autoPlayTimer = null; // 自动播放定时器

// 逐字显示函数
function typeWriter(element, text, speed = 150) {
    element.textContent = '';
    let i = 0;

    return new Promise((resolve) => {
        const timer = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(timer);
                resolve();
            }
        }, speed);
    });
}

// 显示金句和出处
async function showQuote(slideIndex) {
    const slide = slides[slideIndex];
    const quoteElement = slide.querySelector('.quote');
    const sourceElement = slide.querySelector('.source');

    // 先显示金句（逐字显示），使用每条数据自定义的速度
    const speed = slidesData[slideIndex].speed || 150;
    await typeWriter(quoteElement, slidesData[slideIndex].quote, speed);

    // 金句显示完后，显示出处
    sourceElement.textContent = slidesData[slideIndex].source;
}

// 切换幻灯片的通用函数
function goToSlide(index) {
    // 移除当前幻灯片的active类
    slides[currentSlide].classList.remove('active');

    // 重置进度条
    const progressFill = slides[currentSlide].querySelector('.progress-fill');
    progressFill.style.animation = 'none';

    // 更新索引
    currentSlide = index;

    // 添加新幻灯片的active类
    slides[currentSlide].classList.add('active');

    // 重新启动进度条动画
    setTimeout(() => {
        const newProgressFill = slides[currentSlide].querySelector('.progress-fill');
        newProgressFill.style.animation = 'progress 8s linear forwards';
    }, 50);

    // 显示新的金句
    showQuote(currentSlide);

    // 重置自动播放定时器
    resetAutoPlay();
}

// 切换到下一张幻灯片
function nextSlide() {
    const nextIndex = (currentSlide + 1) % totalSlides;
    goToSlide(nextIndex);
}

// 切换到上一张幻灯片
function prevSlide() {
    const prevIndex = (currentSlide - 1 + totalSlides) % totalSlides;
    goToSlide(prevIndex);
}

// 重置自动播放定时器
function resetAutoPlay() {
    if (autoPlayTimer) {
        clearInterval(autoPlayTimer);
    }
    autoPlayTimer = setInterval(nextSlide, slideDuration);
}

// ==================== 第二部分：空间功能 ====================

// 加载空间动态数据
async function loadSpaceData() {
    try {
        const response = await fetch('space-data.json');
        const posts = await response.json();

        // 按日期排序（最新的在前）
        posts.sort((a, b) => new Date(b.date) - new Date(a.date));

        // 渲染动态
        renderPosts(posts);
    } catch (error) {
        console.error('加载动态数据失败:', error);
        document.getElementById('timeline').innerHTML = '<p style="text-align: center; color: white;">暂无动态</p>';
    }
}

// 渲染动态列表
function renderPosts(posts) {
    const timeline = document.getElementById('timeline');
    timeline.innerHTML = '';

    posts.forEach(post => {
        const postCard = createPostCard(post);
        timeline.appendChild(postCard);
    });
}

// 创建单个动态卡片
function createPostCard(post) {
    const card = document.createElement('div');
    card.className = 'post-card';

    // 日期
    const dateDiv = document.createElement('div');
    dateDiv.className = 'post-date';
    dateDiv.textContent = post.date;

    // 内容
    const contentDiv = document.createElement('div');
    contentDiv.className = 'post-content';
    contentDiv.textContent = post.content;

    card.appendChild(dateDiv);
    card.appendChild(contentDiv);

    // 如果有图片，添加图片网格
    if (post.images && post.images.length > 0) {
        const imagesDiv = document.createElement('div');
        imagesDiv.className = `post-images count-${post.images.length}`;

        post.images.forEach(imageSrc => {
            const img = document.createElement('img');
            img.src = imageSrc;
            img.className = 'post-image';
            img.alt = '动态图片';
            img.addEventListener('click', () => openImageViewer(imageSrc));
            imagesDiv.appendChild(img);
        });

        card.appendChild(imagesDiv);
    }

    return card;
}

// 打开图片查看器
function openImageViewer(imageSrc) {
    const viewer = document.getElementById('imageViewer');
    const viewerImage = viewer.querySelector('.viewer-image');

    viewerImage.src = imageSrc;
    viewer.classList.add('active');
}

// 关闭图片查看器
function closeImageViewer() {
    const viewer = document.getElementById('imageViewer');
    viewer.classList.remove('active');
}

// 初始化
function init() {
    // 显示第一张幻灯片的金句
    showQuote(0);

    // 设置自动切换
    autoPlayTimer = setInterval(nextSlide, slideDuration);

    // 绑定左右按钮事件
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);

    // 加载空间动态数据
    loadSpaceData();

    // 绑定图片查看器关闭事件
    const closeBtn = document.querySelector('.close-viewer');
    const viewer = document.getElementById('imageViewer');

    closeBtn.addEventListener('click', closeImageViewer);
    viewer.addEventListener('click', (e) => {
        if (e.target === viewer) {
            closeImageViewer();
        }
    });
}

// 页面加载完成后初始化
window.addEventListener('DOMContentLoaded', init);
