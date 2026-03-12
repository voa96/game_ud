const recipes = {
    "код,дизайн": "Сайт",
    "код,сервер": "Бэкенд",
    "дизайн,сервер": "Дашборд",
    "код,код": "Софт",
    "дизайн,дизайн": "Стиль",
    "сервер,сервер": "Сеть",
    "Сайт,Бэкенд": "Интернет-магазин",
    "Сайт,Стиль": "Приложение",
    "Бэкенд,Сеть": "Облако",
    "Дашборд,Данные": "Аналитика",
    "Софт,Сеть": "Синхронизация",
    "Сеть,Сервер": "Интернет",
    "Сеть,Сигнал": "Антенна",  
    "Приложение,Человек": "Пользователь", 
    "Код,Человек": "Программист",
    "Дизайн,Человек": "Дизайнер",
    "Сервер,Человек": "Сисадмин"
};

const itemImages = {
    // Базовые
    "код": "/IT Алхимия/картинка/код.svg",
    "дизайн": "/IT Алхимия/картинка/дизайн.svg",
    "сервер": "/IT Алхимия/картинка/сервер.svg",
    "сигнал": "/IT Алхимия/картинка/сигнал.svg",
    "человек": "/IT Алхимия/картинка/человек.svg",
    
    // Результаты
    "Сайт": "/IT Алхимия/картинка/сайт.svg",
    "Бэкенд": "/IT Алхимия/картинка/бэкенд.svg",
    "Дашборд": "/IT Алхимия/картинка/дашборд.svg",
    "Софт": "/IT Алхимия/картинка/софт.svg",
    "Стиль": "/IT Алхимия/картинка/стиль.svg",
    "Сеть": "/IT Алхимия/картинка/сеть.svg",
    "Интернет-магазин": "/IT Алхимия/картинка/интернет-магазин.svg",
    "Приложение": "/IT Алхимия/картинка/приложение.svg",
    "Облако": "/IT Алхимия/картинка/облако.svg",
    "Аналитика": "/IT Алхимия/картинка/аналитика.svg",
    "Синхронизация": "/IT Алхимия/картинка/синхронизация.svg",
    "Интернет": "/IT Алхимия/картинка/интернет.svg",
    "Антенна": "/IT Алхимия/картинка/антенна.svg",
    "Пользователь": "/IT Алхимия/картинка/пользователь.svg",
    "Программист": "/IT Алхимия/картинка/программист.svg",
    "Дизайнер": "/IT Алхимия/картинка/дизайнер.svg",
    "Сисадмин": "/IT Алхимия/картинка/сисадмин.svg"
};

let draggedItem = null;      
let draggedId = null;       
let draggedType = null;     
let offsetX = 0;             
let offsetY = 0;

function getItemNameById(id) {
    const names = {
        'код': 'Код',
        'дизайн': 'Дизайн',
        'сервер': 'Сервер',
        'сигнал': 'Сигнал',
        'человек': 'Человек'
    };
    return names[id] || id;
}

function draggableList(item){
    item.setAttribute('draggable', true)
    item.addEventListener('dragstart', function(e){
        draggedItem = this
        draggedType = 'list'
        e.dataTransfer.setData('text/plain', this.id);
        console.log('Тащим:', this.id);
    })
    item.addEventListener('dragend', function(e) {
        draggedItem = null;
        draggedType = null;
    });
}

function fieldSetup(){
    const field = document.querySelector('.collection_field')
    field.addEventListener('dragover', function(e) {
        e.preventDefault();
        this.classList.add('drag-over');
    });
    
    field.addEventListener('dragleave', function(e) {
        this.classList.remove('drag-over');
    });
    
    field.addEventListener('drop', function(e) {
        e.preventDefault();
        this.classList.remove('drag-over');
        
        const itemId = e.dataTransfer.getData('text/plain');
        
        if (draggedType === 'list' && itemId) {
            createItemField(itemId);
            console.log('Создали элемент на поле:', itemId);
        }
    });
}

function createItemField(itemId) {
    const field = document.querySelector('.collection_field')
    
    const itemName = getItemNameById(itemId);
    const imgSrc = itemImages[itemId] || '';
    
    const newItem = document.createElement('div');
    newItem.className = 'item_in_field';
    newItem.dataset.id = itemId;
    newItem.dataset.name = itemName;
    
    const img = document.createElement('img');
    img.className = 'item_picture';
    img.src = imgSrc;
    img.alt = itemName;
    newItem.appendChild(img);
    
    const title = document.createElement('h2');
    title.className = 'nameItem';
    title.textContent = itemName;
    newItem.appendChild(title);
    
    const maxX = field.clientWidth - 120;
    const maxY = field.clientHeight - 120;
    newItem.style.left = Math.random() * maxX + 'px';
    newItem.style.top = Math.random() * maxY + 'px';
    newItem.style.position = 'absolute';
    
    field.appendChild(newItem);
}

document.addEventListener('DOMContentLoaded', function() {
    const listItems = document.querySelectorAll('.items_list .item.open');
    listItems.forEach(item => draggableList(item));
    fieldSetup();
});