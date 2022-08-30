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

        this.addBtn.addEventListener('click', () => this.handleAddClick());
        this.listComponent.addEventListener('click', (ev) => this.handleListClick(ev));
        this.moveDownBtn.addEventListener('click', () => this.handleMoveDownClick());
        this.moveUpBtn.addEventListener('click', () => this.handleMoveUpClick());
        this.saveBtn.addEventListener('click', () => this.handleSaveClick());
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
        this.listArray.push(newItemInput);
        alert("added" + newItemInput);
        this.renderItem(newItemInput, this.listArray.length - 1);
    }

    handleDeleteClick() {
        alert("delete clicked");
    }

    handleListClick(ev) {
        alert("list clicked");
    }
    handleMoveDownClick() {
        alert("move down clicked");
    }
    handleMoveUpClick() {
        alert("move up clicked");
    }
    handleSaveClick() {
        alert("save clicked");
    }
    handleUndoClick() {
        alert("undo clicked");
    }
    handleUpdateClick() {
        alert("update clicked");
    }

    // renderItem(item, index) {
    //     const itm = document.createElement('itm');
    //     itm.classList.add("list-group-item");
    //     itm.innerText = item;
    //     if (index === this.selectedIndex) {
    //         itm.classList.add("active");
    //     }
    //     this.listComponent.appendChild(itm);
    // }
    //
    // renderList() {
    //     // add code to populate the list from this.arrayList
    //     // enable / disable buttons
    //     if (! this.listComponent) {
    //         return;
    //     }
    //     if (this.listComponent)
    //         this.listArray.forEach((item, index) => {
    //             this.renderItem(item, index);
    //         });
    //     this.toggleButtons();
    // }

    renderList() {
        // add code to populate the list from this.arrayList
        // enable / disable buttons
        if (! this.listComponent) {
            return;
        }
        if (this.listComponent)
        this.listArray.forEach((item, index) => {
            const li = document.createElement('li');
            li.classList.add("list-group-item")
            if (index === this.selectedIndex) {
                li.classList.add("active");
            }
            li.innerText = item;
            this.listComponent.appendChild(li);
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