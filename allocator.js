let ordered_items = [];
let warehouse_data = [];

let li_items        = document.getElementById("li_items");
let li_warehouse    = document.getElementById("li_warehouse");
let li_addInventory = document.getElementById("li_addInventory");
let li_process      = document.getElementById("li_process");

li_items.addEventListener('click', toggleItems);
li_warehouse.addEventListener('click', toggleWarehouse);
li_addInventory.addEventListener('click', addInputFields);
li_process.addEventListener('click', processData);

let button_items     = document.getElementById("button_items");
let button_warehouse = document.getElementById("button_warehouse");

button_items.addEventListener('click', addItem);
button_warehouse.addEventListener('click', addWarehouse);

function toggleItems(){
	let li = document.getElementById("li_inputItems");
	let feedback = document.getElementById("li_itemFeedback");

	if (li.style.display == "none"){
		li.style.display = "block";
	}else{
		li.style.display       = "none";
		feedback.style.display = "none";
	}
};

function toggleWarehouse(){
	let li         = document.getElementById("li_inputWarehouse");
	let li_addInv  = document.getElementById("li_addInventory");
	let li_wareInv = document.getElementById("li_inputWarehouseInv");
	let feedback   = document.getElementById("li_warehouseFeedback");

    //Clears out sub-elements
	removeAddedDivs();

	if(li.style.display == "none"){
		li.style.display = "block";
		li_addInv.style.display    = "block";
		li_wareInv.style.display  = "block";
		feedback.innerText = "Click the green 'Add' button to add more items.";
		feedback.style.display = "block";
	}else{
		li.style.display = "none";
		li_addInv.style.display    = "none";
		li_wareInv.style.display = "none";
		feedback.style.display = "none";
	}
};

function removeAddedDivs(){
	let addedDivs = document.querySelectorAll(".input_added");

	for(i = 1; i < addedDivs.length; i++){
		addedDivs[i].innerText = "";
		addedDivs[i].style.display = "none";
	}
}

function addInputFields(){
	let parent            = document.getElementById("ul_main");
	let li_placeBefore    = document.getElementById("li_process");
	let li                = document.createElement("li");
	let input_invName     = document.createElement("input");
	let input_invAmount   = document.createElement("input");
	let button_delete     = document.createElement("button");

	input_invName.type = "text";            input_invName.placeholder   = "Item Name";
	input_invName.classList.add("warehouse_invName");
	input_invAmount.type = "number";        input_invAmount.placeholder = "Quantity of Item";
	input_invAmount.classList.add("warehouse_invAmount");
	button_delete.innerText = "Delete";

	li.classList.add("input_added");

	li.appendChild(input_invName);
	li.appendChild(input_invAmount);
	li.appendChild(button_delete);
	
	parent.insertBefore(li, li_placeBefore);
	button_delete.addEventListener("click", deleteInputField);
};

function addItem(){
	let item_name   = document.getElementById("input_itemName").value.toLowerCase();
	let item_amount = document.getElementById("input_itemAmount").value;
	item_amount = parseInt(item_amount, 10);
	let feedback_div    = document.getElementById("li_itemFeedback");

	let item = {name: item_name, amount: item_amount};

	feedback_div.innerText     = "";
	feedback_div.style.display = "block";

	if(item_name == ""){
		feedback_div.innerText = "Please enter the item's name. ";
		return;
	}
	if( (item_amount <= 0) || (isNaN(item_amount) ) ){
		feedback_div.innerText += " Please enter a number greater than 0. ";
		return;
	}
	else if(alreadyHaveItem(item_name.toLowerCase(), item_amount) ){
		//This function adds the amount to the item name already in array
		feedback_div.innerText = "Item already exists, the amount was added to existing quantity.";
		refreshItemTable();
	}
	else if( (item_name != "") && (item_amount > 0) ){
		feedback_div.style.display = "none";
		ordered_items.push(item);
		addItemToTable(item);

		//Clear input forms
		document.getElementById("input_itemName").value = "";
		document.getElementById("input_itemAmount").value = "";
	}
};

function addItemToTable(item){
	let div    = document.getElementById("div_items");
	let table  = document.getElementById("table_items");
	let row    = document.createElement("tr");
	let index  = document.createElement("td");
	let name   = document.createElement("td");
	let amount = document.createElement("td");
	let remove = document.createElement("td");

    //Setting up delete button
	let button_remove = document.createElement("button");
	button_remove.innerText = "Delete";
	button_remove.addEventListener("click", deleteItem);
	remove.appendChild(button_remove);

	div.style.display = "block";
	index.innerText   = ordered_items.length;
	name.innerText    = item.name;
	amount.innerText  = item.amount;

	row.appendChild(index);
	row.appendChild(name);
	row.appendChild(amount);
	row.appendChild(remove);
	table.appendChild(row);
};

function refreshItemTable(){
	let table    = document.getElementById("table_items");
	let array_tr = table.querySelectorAll("tr");

	//Remove all rows
	for(m = 1; m < array_tr.length; m++){
		array_tr[m].remove();
	}

	//Add new rows
	for(n = 0; n < ordered_items.length; n ++){
		let row    = document.createElement("tr");  let index  = document.createElement("td");
	    let name   = document.createElement("td");  let amount = document.createElement("td");
	    let remove = document.createElement("td");

	    //Setting up delete button
	    let button_remove = document.createElement("button");
	    button_remove.innerText = "Delete";
	    button_remove.addEventListener("click", deleteItem);
	    remove.appendChild(button_remove);

	    index.innerText   = n + 1;
	    name.innerText    = ordered_items[n].name;
	    amount.innerText  = ordered_items[n].amount;

	    row.appendChild(index);
	    row.appendChild(name);
	    row.appendChild(amount);
	    row.appendChild(remove);
	    table.appendChild(row);
	}
};

function addWarehouse(){
	let warehouse_name = document.getElementById("input_warehouseName").value;
	let feedback_div   = document.getElementById("li_warehouseFeedback");

	feedback_div.innerText = "";
	feedback_div.style.display = "block";

	if (warehouse_name == ""){
		feedback_div.innerText = "Please enter the warehouse's name. ";
		return;
	}
	if (nameAlreadyExists( warehouse_name.toLowerCase() ) ){
		feedback_div.innerText = "Please pick a different warehouse name. ";
		return;
	}
	if (inputHasErrors()){
		feedback_div.innerText = "One of the input fields is empty or an amount is less than 1.";
		return;
	}

	let warehouse = {
		name: warehouse_name,
		inventory: []
	};

	let name_array   = document.querySelectorAll(".warehouse_invName");
	let amount_array = document.querySelectorAll(".warehouse_invAmount");

	//Gathers the data from each input field
	if( (name_array.length > 0) && (amount_array.length > 0)){
		for( c = 0; c < name_array.length; c ++){
			let name   = name_array[c].value.toLowerCase();
			let amount = amount_array[c].value;
			amount = parseInt(amount, 10);
			let item = {name: name, amount: amount};
			warehouse.inventory.push(item);
		}
	}

	warehouse_data.push(warehouse);
	createWarehouseTable();

	//Clear feedback div
	toggleWarehouse();
};

function createWarehouseTable(){
	let last      = warehouse_data.length - 1;
	let div       = document.getElementById("div_warehouse");
	let table     = document.createElement("table");
	let title     = document.createElement("caption");
	let thead     = document.createElement("thead");
	let row       = document.createElement("tr");
	let index     = document.createElement("th");
	let name      = document.createElement("th");
	let amount    = document.createElement("th");

	title.innerText = warehouse_data[last].name;
	index.innerText = "Index";   name.innerText= "Item Name";     amount.innerText = "Amount";
	row.appendChild(index);      row.appendChild(name);           row.appendChild(amount);
	thead.appendChild(row);      table.appendChild(title);        table.appendChild(thead);
	div.appendChild(table);      div.style.display = "block";

	//Loops through all inventory items in the warehouse
	for(p = 0; p < warehouse_data[last].inventory.length; p++){
		let inventory = warehouse_data[last].inventory[p];
		let tRow    = document.createElement("tr");
		let tIndex  = document.createElement("td");
		let tName   = document.createElement("td");
		let tAmount = document.createElement("td");

		tIndex.innerText = p +1;    tName.innerText = inventory.name;    tAmount.innerText = inventory.amount;
		tRow.appendChild(tIndex);   tRow.appendChild(tName);             tRow.appendChild(tAmount);
		table.appendChild(tRow);
	}

};

function nameAlreadyExists(input){
	for(a = 0; a < warehouse_data.length; a ++){
		if (warehouse_data[a].name.toLowerCase() == input){
			return true;
		}
	}
	return false;
};

function deleteInputField(e){
	e.target.parentNode.remove();
};

function inputHasErrors(){
	let input_names  = document.querySelectorAll(".warehouse_invName");
	let input_amount = document.querySelectorAll(".warehouse_invAmount");

	for(b = 0; b < input_names.length; b ++){
		if( (input_names[b].value == "") || (input_amount[b].value <= 0) ){
			return true;
		}
	}
	return false;
};

function deleteItem(e){
	let array_td = e.target.parentNode.parentNode.querySelectorAll("td");
	let item_name = array_td[1].innerText;
	removeFromItemArray(item_name);
	e.target.parentNode.parentNode.remove();
};

function removeFromItemArray(item_name){
	let array_temp = [];

	//Make new array which excludes the item that was passed in
	for(x = 0; x < ordered_items.length; x ++){
		if(ordered_items[x].name == item_name){
			continue;
		}else{
			array_temp.push(ordered_items[x]);
		}
	}

	ordered_items = array_temp;
};

function alreadyHaveItem(item_name, item_amount){

	for(y = 0; y < ordered_items.length; y ++){
		if(item_name == ordered_items[y].name){
			ordered_items[y].amount = ordered_items[y].amount + item_amount;
			return true;
		}
	}

	return false;
};


function processData(){
	let div       = document.getElementById("div_results");
	let table     = document.createElement("table");

	div.style.display = "block";

	//Process each item
	for(t = 0; t < ordered_items.length; t ++){
		let product   = ordered_items[t].name;
		let quantity  = ordered_items[t].amount;

		let response = checkWarehouseInventory(product, quantity);

		let tr         = document.createElement("tr");
		let td_item    = document.createElement("td");
		let td_result  = document.createElement("td");

		td_item.innerText = product;
		td_result.innerText = response;

		//Combining all the elements together to form table
		tr.appendChild(td_item);  tr.appendChild(td_result);  table.appendChild(tr);  div.appendChild(table);
	}



};

function checkWarehouseInventory(target_name, target_amount){
	let target_total = target_amount;
	let output       = "";

	for(u = 0; u < warehouse_data.length; u ++){

		for(z = 0; z < warehouse_data[u].inventory.length; z ++){
			let warehouse = warehouse_data[u];
			let item = warehouse_data[u].inventory[z];

			if(target_name == item.name){

				if(target_total <= item.amount){
					output += warehouse.name + " -" + target_total + " " + target_name + "s.";
					return output;
				}else{
					target_total -= item.amount;
					output += warehouse.name + " -" + item.amount + " " + target_name + "s. ";
					break;
				}
			}
		}
	}

	output = "There are not enough " + target_name + "s in inventory.";
	return output;
};





//================================================
// Testing Section Below
//================================================

let button_test = document.getElementById("button_testOrder");
button_test.addEventListener("click", testAddingItem);

let button_testW = document.getElementById("button_testWarehouse");
button_testW.addEventListener("click", testAddingWarehouse);

function testAddingItem(){
	let test_arr = [
	    {name: "error",      amount: -1},
	    {name: "apple",      amount: 20},
	    {name: "error",      amount: "haha"},
	    {name: "grape",      amount: 35},
	    {name: "error",      amount: -20},
	    {name: "kiwi",       amount: 15},
	    {name: "error",      amount: 0},
	    {name: "potatoe",    amount: 10},
	    {name: "error",      amount: null},
	    {name: "water",      amount: 200},
	    {name: "error",      amount: -2},
	    {name: "orange",     amount: 999999},
	    {name: "error",      amount: -1},
	    {name: "avocado",    amount: 5},
	    {name: "plantain",   amount: 12}
	];

	//Each iteration of the loop adds an item
	for(h = 0; h < test_arr.length; h ++){
		toggleItems();
		let name = test_arr[h].name;
	    let test_name   = document.getElementById("input_itemName");
	    let test_amount = document.getElementById("input_itemAmount");
	    test_name.value = name;
	    test_amount.value = test_arr[h].amount;
	    addItem();
	}
};

function testAddingWarehouse(){
	let test_data = [
	    { name: "Maximum Storage",  inventory: [  {name: "apple",   amount: 5},     {name: "grape",    amount: 2} ] },
	    { name: "Maximum Storage",  inventory: [  {name: "apple",   amount: 5},     {name: "grape",    amount: 2} ] },
	    { name: "Warehouse Mania",  inventory: [  {name: "apple",   amount: 5},     {name: "plantain", amount: 200} ] },
	    { name: "Fruit Solutions",  inventory: [  {name: "apple",   amount: 5},     {name: "avocado",  amount: 20} ] },
	    { name: "Jimmys Warehouse", inventory: [  {name: "apple",   amount: 5},     {name: "water",    amount: 50} ] },
	    { name: "Lots of Stuff",    inventory: [  {name: "orange",  amount: 900},   {name: "grape",    amount: 50} ] },
	    { name: "Lots of Stuff",    inventory: [  {name: "orange",  amount: 350},   {name: "grape",    amount: 2} ] },
	    { name: "Fruitful Ware",    inventory: [  {name: "potatoe", amount: 100},   {name: "kiwi",     amount: 10} ] }
	];



	//Each iteration of the loop adds a warehouse
	for(r = 0; r < test_data.length; r ++){
		toggleWarehouse();
		let warehouse = test_data[r];

		let item_name   = warehouse.inventory[0].name;
		let item_amount = warehouse.inventory[0].amount;

		let input_forName            = document.getElementById("input_warehouseName");
		input_forName.value          = warehouse.name;
		let input_forItemName        = document.querySelectorAll(".warehouse_invName");
		input_forItemName[0].value   = item_name;
	    let input_forItemAmount      = document.querySelectorAll(".warehouse_invAmount");
	    input_forItemAmount[0].value = item_amount;

	    let num_items = warehouse.inventory.length;

		if(num_items > 1){
			for (v = 1; v < num_items; v ++){
				addInputFields();

				item_name   = warehouse.inventory[v].name;
				item_amount = warehouse.inventory[v].amount;

		        input_forItemName            = document.querySelectorAll(".warehouse_invName");
		        input_forItemName[v].value   = item_name;
	            input_forItemAmount          = document.querySelectorAll(".warehouse_invAmount");
	            input_forItemAmount[v].value = item_amount;
	            addWarehouse();
			}
		}
	}
};