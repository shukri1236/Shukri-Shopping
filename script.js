const itemInput = document.getElementById('item-input');
const addBtn = document.getElementById('add-btn');
const shoppingList = document.getElementById('shopping-list');
const clearBtn = document.getElementById('clear-btn');

let items = JSON.parse(localStorage.getItem('shoppingList')) || [];

function renderList() {
    shoppingList.innerHTML = '';
    items.forEach((item, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span class="item-text">${item.text}</span>
            <div>
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
                <button class="purchase-btn">${item.purchased ? 'Unpurchase' : 'Purchase'}</button>
            </div>
        `;
        if (item.purchased) {
            li.classList.add('purchased');
        }
        shoppingList.appendChild(li);

        const editBtn = li.querySelector('.edit-btn');
        const deleteBtn = li.querySelector('.delete-btn');
        const purchaseBtn = li.querySelector('.purchase-btn');

        editBtn.addEventListener('click', () => editItem(index));
        deleteBtn.addEventListener('click', () => deleteItem(index));
        purchaseBtn.addEventListener('click', () => togglePurchase(index));
    });
    saveToLocalStorage();
}

function addItem() {
    const text = itemInput.value.trim();
    if (text) {
        items.push({ text, purchased: false });
        itemInput.value = '';
        renderList();
    }
}

function editItem(index) {
    const li = shoppingList.children[index];
    const span = li.querySelector('.item-text');
    const text = span.textContent;

    const input = document.createElement('input');
    input.type = 'text';
    input.value = text;
    input.classList.add('edit-input');

    li.insertBefore(input, span);
    li.removeChild(span);

    input.focus();

    input.addEventListener('blur', function() {
        const newText = this.value.trim();
        if (newText) {
            items[index].text = newText;
            renderList();
        } else {
            li.insertBefore(span, this);
            li.removeChild(this);
        }
    });

    input.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            this.blur();
        }
    });
}

function deleteItem(index) {
    items.splice(index, 1);
    renderList();
}

function togglePurchase(index) {
    items[index].purchased = !items[index].purchased;
    renderList();
}

function clearList() {
    items = [];
    renderList();
}

function saveToLocalStorage() {
    localStorage.setItem('shoppingList', JSON.stringify(items));
}

addBtn.addEventListener('click', addItem);
clearBtn.addEventListener('click', clearList);
itemInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        addItem();
    }
});

renderList();
