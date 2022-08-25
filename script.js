let ExpenseDetails = document.getElementById("ExpenseDetails");
let DescriptionDetails = document.getElementById("DescriptionDetails")
let CategoryDetails = document.getElementById("CategoryDetails");
let usersList = document.getElementById("users");


function saveData(e) {
    const message = document.getElementById("displayError");
    message.innerHTML = "";
    try {
      const expense = e.target.ExpenseDetails.value;
      const description = e.target.DescriptionDetails.value;
      const category = e.target.CategoryDetails.value;
      if (expense == "" || description == "" || category == "")
      throw "Input field must not be empty";
      if (isNaN(expense)) throw "Expense field must be a number";
      const obj = {
        expense,
        description,
        category,
      };
    axios.post("https://crudcrud.com/api/c19e73daaf2548b18c84763e7de64953/Expense",obj)
    .then((response) => {

      if(response.status === 201){
        // displayListOnScreen(response.data.expense);
        getList();
      } else {
          throw new Error('Failed To create new expense');
      }
      })
    .catch(err => showError(err))
  } catch (error) {
    message.innerHTML = "Error: " + error + ".";
  }

}

window.addEventListener("load",getList);

function displayListOnScreen(user) {


    const parentNode = usersList;
    const expenseElemId = `expense-${user._id}`;
    const childHTML = `<li id=${expenseElemId} class="list-group-item"> <span class="font-style">${user.expense}</span> - <span class="crimson-text">${user.description}</span>
                              <button type="button" id="btn1" class="btn btn-danger btn-xs" onclick=deleteList('${user._id}')> Delete </button>
                              <button type="button" id="btn2" class="btn btn-primary btn-xs" onclick=editList('${user._id}','${user.description}','${user.expense}','${user.category}')>Edit</button>
                           </li>`;

    parentNode.innerHTML = parentNode.innerHTML + childHTML;

}

//Edit

function editList(expenseid,description, expense, category) {
  ExpenseDetails.value = expense;
  DescriptionDetails.value = description;
  CategoryDetails.value = category;

    //deleting
    axios.delete(`https://crudcrud.com/api/c19e73daaf2548b18c84763e7de64953/Expense/${expenseid}`).then((response) => {
      if(response.status === 200){
        removeListFromScreen(expenseid);
          } else {
              throw new Error('Failed to delete');
          }
      }).catch((err => {
          showError(err);
      }))
}

// Delete

function deleteList(expenseid) {
  if (confirm("Are you sure to delete this record ?")) {
    axios.delete(`https://crudcrud.com/api/c19e73daaf2548b18c84763e7de64953/Expense/${expenseid}`).then((response) => {
    if(response.status === 200){
        removeListFromScreen(expenseid);
        getList();
          } else {
              throw new Error('Failed to delete');
          }
      }).catch((err => {
          showError(err);
      }))
  }
}

function showError(err){
  document.getElementById('displayError').innerHTML =err
}

function removeListFromScreen(expenseid) {
  const expenseElemId = `expense-${expenseid}`;
  document.getElementById(expenseElemId).remove();
}

function getList(){
  axios.get("https://crudcrud.com/api/c19e73daaf2548b18c84763e7de64953/Expense").then(response => {
        if(response.status === 200){
            usersList.innerHTML="";
            ExpenseDetails.value="";
            DescriptionDetails.value="";
            CategoryDetails.value="";
            ExpenseDetails.focus();
            response.data.forEach(expense => {
              displayListOnScreen(expense);
             // console.log(expense)
            })
        } else {
            throw new Error();
        }
    })
}