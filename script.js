let ExpenseDetails = document.getElementById("ExpenseDetails");
let DescriptionDetails = document.getElementById("DescriptionDetails")
let CategoryDetails = document.getElementById("CategoryDetails");
let usersList = document.getElementById("users");


async function saveData(e) {
  try {
      e.preventDefault()
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
      const response = await axios.post("https://crudcrud.com/api/a68e785ac20d454c8494f7304e787ae6/Expense",obj);
      if(response.status === 201){
             displayListOnScreen(response.data);
             resetForm();
      }else {
            throw new Error('Failed To create new expense');
      }
  } catch (error) {
    showError(error);
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

async function editList(expenseid,description, expense, category) {
    try {
      ExpenseDetails.value = expense;
      DescriptionDetails.value = description;
      CategoryDetails.value = category;
    
      const response = await axios.delete(`https://crudcrud.com/api/a68e785ac20d454c8494f7304e787ae6/Expense/${expenseid}`);
      if(response.status === 200){
          removeListFromScreen(expenseid);
      }else {
          throw new Error('Failed to delete');
      }
      }catch (error) {
        showError(error);
      }
}

// Delete
async function deleteList(expenseid) {
  try {
  if (confirm("Are you sure to delete this record ?")) {
      const response = await axios.delete(`https://crudcrud.com/api/a68e785ac20d454c8494f7304e787ae6/Expense/${expenseid}`);
      if(response.status === 200){
         removeListFromScreen(expenseid);
      }else {
          throw new Error('Failed to delete');
      }
   }
  }catch (error) {
    showError(error);
  }
}

function showError(err){
  document.getElementById('displayError').innerHTML =err
}

function removeListFromScreen(expenseid) {
  const expenseElemId = `expense-${expenseid}`;
  document.getElementById(expenseElemId).remove();
}

function resetForm(){
  ExpenseDetails.value="";
  DescriptionDetails.value="";
  CategoryDetails.value="";
  ExpenseDetails.focus();
}

async function getList(){
    try {
        const response = await axios.get("https://crudcrud.com/api/a68e785ac20d454c8494f7304e787ae6/Expense");
        if(response.status === 200){
                  usersList.innerHTML="";
                  resetForm();
                  response.data.forEach(expense => {
                     displayListOnScreen(expense);
                  })
        }else {
          throw new Error('Oops! something went wrong');
        }
    }catch (error) {
      showError(error);
    }
}