// ==================== РЕЦЕПТЫ ====================
const recipes = {
    "код,дизайн": "Сайт",
    "код,сервер": "Бэкенд",
    "дизайн,сервер": "Дашборд",
    "код,код": "Софт",
    "дизайн,дизайн": "Стиль",
    "сервер,сервер": "Сеть",

    "сайт,бэкенд": "Интернет-магазин",
    "сайт,стиль": "Приложение",
    "бэкенд,сеть": "Облако",
    "дашборд,данные": "Аналитика",
    "софт,сеть": "Синхронизация",
    "сеть,сервер": "Интернет",
};

const itemImages = {
    "код": "/IT Алхимия/картинка/код.svg",
    "дизайн": "/IT Алхимия/картинка/дизайн.svg",
    "сервер": "/IT Алхимия/картинка/сервер.svg",
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
};

let draggedItem = null;      
let draggedType = null;      
let offsetX = 0;             
let offsetY = 0;


function getItemNameById(id) {
    const names = {
        'код': 'Код',
        'дизайн': 'Дизайн',
        'сервер': 'Сервер',
    };
    return names[id] || id;
}

function draggableList(item) {
    item.setAttribute('draggable', true);
    
    item.addEventListener('dragstart', function(e) {
        draggedItem = this;
        draggedType = 'list';
        e.dataTransfer.setData('text/plain', this.id);
        this.style.opacity = '0.5';
    });
    
    item.addEventListener('dragend', function(e) {
        this.style.opacity = '1';
        draggedItem = null;
        draggedType = null;
    });
}
function fieldSetup() {
    const field = document.querySelector('.collection_field');
    
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
        }
    });
}


function makeFieldItemDraggable(item) {
    let isDragging = false;
    let startX, startY, startLeft, startTop;
    
    if (!item.style.left) item.style.left = '0px';
    if (!item.style.top) item.style.top = '0px';
    
    item.addEventListener('mousedown', function(e) {
        e.preventDefault();
        
        isDragging = true;
        draggedItem = this;
        draggedType = 'field';
        
        startX = e.clientX;
        startY = e.clientY;
        startLeft = parseFloat(this.style.left);
        startTop = parseFloat(this.style.top);
        
        this.style.zIndex = '1000';
        this.style.opacity = '0.8';
    });
    
    document.addEventListener('mousemove', function(e) {
        if (!isDragging || !draggedItem) return;
        
        e.preventDefault();
        
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        
        let newLeft = startLeft + dx;
        let newTop = startTop + dy;
        
        const field = document.querySelector('.collection_field');
        const fieldRect = field.getBoundingClientRect();
        const itemRect = draggedItem.getBoundingClientRect();
        
        // Ограничиваем движение в пределах поля
        newLeft = Math.max(0, Math.min(newLeft, fieldRect.width - itemRect.width));
        newTop = Math.max(0, Math.min(newTop, fieldRect.height - itemRect.height));
        
        draggedItem.style.left = newLeft + 'px';
        draggedItem.style.top = newTop + 'px';
    });
    
    document.addEventListener('mouseup', function(e) {
        if (isDragging && draggedItem) {
            isDragging = false;
            
            draggedItem.style.zIndex = '1';
            draggedItem.style.opacity = '1';
            
            checkCombination(draggedItem);
            
            draggedItem = null;
            draggedType = null;
        }
    });
}

function checkCombination(item) {
    const fieldItems = document.querySelectorAll('.collection_field .item_in_field');
    
    fieldItems.forEach(otherItem => {
        if (otherItem === item) return;
        
        const rect1 = item.getBoundingClientRect();
        const rect2 = otherItem.getBoundingClientRect();
        if (!(rect1.right < rect2.left || 
            rect1.left > rect2.right || 
            rect1.bottom < rect2.top || 
            rect1.top > rect2.bottom)) {
            
            checkRecipe(item, otherItem);
        }
    });
}

function checkRecipe(item1, item2) {
    const name1 = item1.dataset.name.toLowerCase();
    const name2 = item2.dataset.name.toLowerCase();
    
    const combination1 = `${name1},${name2}`;
    const combination2 = `${name2},${name1}`;
    
    let result = recipes[combination1] || recipes[combination2];
    
    if (result) {
        console.log(`✅ Рецепт найден: ${name1} + ${name2} = ${result}`);
        
        const left = item1.style.left;
        const top = item1.style.top;
        
        item1.remove();
        item2.remove();
        
        createResultField(result, left, top);
        
        
        return true;
    } else {
        return false;
    }
}


function createItemField(itemId) {
    const field = document.querySelector('.collection_field');
    
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
    
    makeFieldItemDraggable(newItem);
    
    field.appendChild(newItem);
}

// ==================== СОЗДАНИЕ ЭЛЕМЕНТА-РЕЗУЛЬТАТА ====================
function createResultField(resultName, left = 0, top = 0) {
    const field = document.querySelector('.collection_field');
    
    const newItem = document.createElement('div');
    newItem.className = 'item_in_field';
    newItem.dataset.id = resultName;
    newItem.dataset.name = resultName;
    
    const img = document.createElement('img');
    img.className = 'item_picture';
    img.src = itemImages[resultName] || '';
    img.alt = resultName;
    newItem.appendChild(img);
    
    const title = document.createElement('h2');
    title.className = 'nameItem';
    title.textContent = resultName;
    newItem.appendChild(title);
    
    if (left && top) {
        newItem.style.left = left;
        newItem.style.top = top;
    } else {
        newItem.style.left = 0
        newItem.style.top = 0
    }
    makeFieldItemDraggable(newItem);
    
    field.appendChild(newItem);
}

document.addEventListener('DOMContentLoaded', function() {
    
    const listItems = document.querySelectorAll('.items_list .item.open');
    
    listItems.forEach(item => draggableList(item));
    
    fieldSetup();
    
});