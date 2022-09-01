class ListEditor extends HTMLElement {
    // for bootstrap components see: https://getbootstrap.com/docs/5.0/getting-started/introduction/
    // for bootstrap icons see: https://icons.getbootstrap.com
    constructor() {
        super();
        console.log("constructor");
        this.addBtn = null;
        this.deleteBtn = null;
        this.listArray = [];
        this.changes = [];
        this.listComponent = null;
        this.moveDownBtn = null;
        this.moveUpBtn = null;
        this.saveBtn = null;
        this.selectedIndex = 0;
        this.undoBtn = null;
        this.updateBtn = null;
    }

    connectedCallback() {
        console.log("connectedCallback");
        this.innerHTML =
            `
<style> 
  @import url('static/css/bootstrap.min.css');
  @import url('static/img/bootstrap-icons.css');
</style>
<style>
  #listEditorContainer {
    margin-top: 10%;
  }
  #listEditorTitle {
    color: blue;
  }
  #itemInput {
    width: 100%;
  }
</style>
        <div id="listEditorContainer" class="container container-fluid">
            <div class="row p-1">
                <div class="col col-2">
                </div>
                <div class="col col-8">
                <h6 id="listEditorTitle">${this.title}</h6>
                <ol id="listEditorItems" class="list-group  list-group-numbered">
                </ol>
                </div>
                <div class="col col-2">
                </div>
            </div>
            <hr/>
            <div class="row p-1">
                <div class="col col-2"></div>
                <div class="col col-6">                    
                    <input id="itemInput" type="text" class="form-control" placeholder="Item" aria-label="Item"></input>
                </div>
                <div class="col col-4">
                    <button id="updateBtn" type="button" class="btn btn-primary">Update</button>
                    <button id="addBtn" type="button" class="btn btn-primary">Add</button>
                </div>
            </div>
            <div class="row p-1">
                <div class="col col-2"></div>
                <div class="col col-8">
                        <button id="saveBtn" type="button" class="btn btn-primary"><i class="bi-save" style="color: white;"></i></button>
                        <button id="undoBtn" type="button" class="btn btn-warning"><i class="bi-arrow-counterclockwise" style="color: black;"></i></button>
                        <button id="deleteBtn" type="button" class="btn btn-danger"><i class="bi-trash" style="color: white;"></i></button>
                        <button id="moveUpBtn" type="button" class="btn btn-primary"><i class="bi-arrow-up" style="color: white;"></i></button>
                        <button id="moveDownBtn" type="button" class="btn btn-primary"><i class="bi-arrow-down" style="color: white;"></i></button>
                </div>
                <div class="col col-2"></div>
            </div>                
        </div>
`;
        this.addBtn = this.querySelector("#addBtn");
        this.deleteBtn = this.querySelector("#deleteBtn");
        this.listComponent = this.querySelector("#listEditorItems");
        this.moveDownBtn = this.querySelector("#moveDownBtn");
        this.moveUpBtn = this.querySelector("#moveUpBtn");
        this.saveBtn = this.querySelector("#saveBtn");
        this.undoBtn = this.querySelector("#undoBtn");
        this.updateBtn = this.querySelector("#updateBtn");
        this.itemInput = this.querySelector("#itemInput");
        const listEl = document.getElementsByClassName("list-group-item");

        this.addBtn.addEventListener('click', () => this.handleAddClick());
        this.listComponent.addEventListener('click', (ev) => this.handleListClick(ev));
        this.moveDownBtn.addEventListener('click', () => this.handleMoveDownClick());
        this.moveUpBtn.addEventListener('click', () => this.handleMoveUpClick());
        this.saveBtn.addEventListener('click', () => this.handleSaveClick());
        this.deleteBtn.addEventListener('click', () => this.handleDeleteClick());
        this.undoBtn.addEventListener('click', () => this.handleUndoClick());
        this.updateBtn.addEventListener('click', () => this.handleUpdateClick());
        if (this.items) {
            this.listArray = JSON.parse(this.items);
            this.renderList();
        }
    }
    // for every event handler added above, below remove it
    disconnectedCallback() {
        this.addBtn.removeEventListener('click', () => this.handleAddClick());
        this.deleteBtn.removeEventListener('click', () => this.handleDeleteClick());
        this.listComponent.removeEventListener('click', (ev) => this.handleListClick(ev));
        this.moveDownBtn.removeEventListener('click', () => this.handleMoveDownClick());
        this.moveUpBtn.removeEventListener('click', () => this.handleMoveUpClick());
        this.saveBtn.removeEventListener('click', () => this.handleSaveClick());
        this.undoBtn.removeEventListener('click', () => this.handleUndoClick());
        this.updateBtn.removeEventListener('click', () => this.handleUpdateClick());
    }

    handleAddClick() {
        const newItemInput = this.itemInput.value;
        if (!this.isDuplicate(newItemInput)) {
            this.listArray.push(newItemInput);
            this.deselectEachListElement();
            this.selectedIndex = this.listArray.length - 1; // Set the selected index to the added item to it is rendered as active
            this.renderItem(newItemInput, this.listArray.length - 1);
            this.itemInput.value = this.listArray[this.selectedIndex];
        } else {
            alert("Please enter a unique name");
        }
    }

    handleDeleteClick() {
        this.listArray.splice(this.selectedIndex, 1); // Remove the selected item from the listArray
        this.renderList();
    }

    handleListClick(ev) {
        this.deselectEachListElement(); // To keep only one list element selected at a time, first reset them all
        ev.target.classList.add("active");
        this.listArray.forEach((item, index) => { // Set selectedIndex to the index of the new selected item
            if (ev.target.innerText === item) {
                this.selectedIndex = index;
            }
        });
        this.itemInput.value = ev.target.innerText; // Display the content of the selected list item in the input box
    }

    handleMoveDownClick() {
        //alert("move down clicked");
        if (this.selectedIndex !== this.listArray.length - 1) { // If the item is not at the end of the list...
            let tempNextItem = this.listArray[this.selectedIndex + 1]
            this.listArray[this.selectedIndex + 1] = this.listArray[this.selectedIndex];
            this.listArray[this.selectedIndex] = tempNextItem;
            this.selectedIndex += 1;
        } else { // If it is, swap the first and last items
            let tempFirstItem = this.listArray[0];
            this.listArray[0] = this.listArray[this.selectedIndex];
            this.listArray[this.selectedIndex] = tempFirstItem;
            this.selectedIndex = 0;
        }
        this.renderList();
    }
    handleMoveUpClick() {
        if (this.selectedIndex !== 0) {
            let tempItemAbove = this.listArray[this.selectedIndex - 1]
            this.listArray[this.selectedIndex - 1] = this.listArray[this.selectedIndex];
            this.listArray[this.selectedIndex] = tempItemAbove;
            this.selectedIndex -= 1;
        } else {
            let tempLastItem = this.listArray[this.listArray.length - 1];
            this.listArray[this.listArray.length - 1] = this.listArray[this.selectedIndex];
            this.listArray[this.selectedIndex] = tempLastItem;
            this.selectedIndex = this.listArray.length - 1;
        }
        this.renderList();
    }
    handleSaveClick() {
        alert("save clicked");
    }
    handleUndoClick() {
        alert("undo clicked");
    }
    handleUpdateClick() {
        if (!this.isDuplicate(this.itemInput.value)) {
            this.listArray[this.selectedIndex] = this.itemInput.value;
            this.renderList()
        }
        else if (this.listArray[this.selectedIndex] !== this.itemInput.value) {
            alert("List items cannot have duplicate names")
        }
    }

    deselectEachListElement() {
        const listElements = this.listComponent.children;
        for (let i = 0; i < listElements.length; i++) {
            listElements[i].classList.remove("active");
        }
    }

    isDuplicate(newName) {
        let duplicate = false;
        this.listArray.forEach((item, index) => {
           if (newName === item) {
               duplicate = true;
           }
        });
        return duplicate;
    }

    renderItem(item, index) {
        const itm = document.createElement('li');
        itm.classList.add("list-group-item");
        itm.innerText = item;
        if (index === this.selectedIndex) {
            itm.classList.add("active");
        }
        this.listComponent.appendChild(itm);
    }

    renderList() {
        // add code to populate the list from this.arrayList
        // enable / disable buttons
        if (! this.listComponent) {
            return;
        }
        this.listComponent.innerHTML = "";
        if (this.listComponent)
            this.listArray.forEach((item, index) => {
                this.renderItem(item, index);
            });
        this.toggleButtons();
    }

    toggleButtons() {

    }
    static get observedAttributes() {
        return ['items'];
    }

    attributeChangedCallback(name, oldVal, newVal) {
        console.log(`Attribute: ${name} changed from ${oldVal} to ${newVal}!`);
        switch (name) {
            case "items": {
                if (newVal != null && oldVal != newVal) {
                    this.listArray = JSON.parse(newVal);
                    this.renderList();
                }
                break;
            }
            case "title": {
                if (newVal != null && oldVal != newVal) {
                    this.querySelector("#listEditorTitle").innerText = newVal;
                }
                break;
            }
        }
    }

    adoptedCallback() {
    }
    get items() {
        return this.getAttribute("items");
    }
    set items(value) {
        this.setAttribute("items", value);
    }

    get title() {
        return this.getAttribute("title");
    }
    set title(value) {
        this.setAttribute("title", value);
    }

}

window.customElements.define('list-editor', ListEditor);