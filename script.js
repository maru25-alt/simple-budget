//what i am going to learn 
//1. how to use the module pattern
//2. more about private and public data , encapsulation and separation of concerns



//budget controller
var budgetController = (function(){
    //some code
    var expense = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };
    //lavishbeautybyzo

    var income = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };
    var calculateTotal = function(type){
        var sum  = 0
        data.allItems[type].forEach(function(current){
           sum += current.value;
        });
        data.total[type] = sum;
    }

    var data = {
        allItems: {
            exp: [],
            inc: [],
        },
        total: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1,

    };
    return{
        addItems: function(type, des, val){
            var newItem, ID;
            //create new id
            if(data.allItems[type].length > 0){
                ID = data.allItems[type][data.allItems[type].length -1].id + 1;
            }
            else{
                ID = 0;
            }
     
           
        //create new item
            if(type === 'exp'){
                newItem = new expense(ID, des, val);
            }else if(type === 'inc'){
                newItem = new income(ID, des, val);
            }
//push 
            data.allItems[type].push(newItem);
            return newItem;
            

        },
        deleteItem: function(type, id){
            var index, ids
            //console.log(type)
          ids =  data.allItems[type].map(function(current){
                 return current.id;
             })

             index = ids.indexOf(id);

             if(index !== (-1)){
                data.allItems[type].slice(index, 1)
             }
        },
        calculateBudget: function(){
            //calculate total income and exp 
            calculateTotal('exp');
            calculateTotal('inc');

            //calculate the budget
            data.budget = data.total.inc - data.total.exp;

            // cal the % of income we spent
            if(data.total.inc > 0){
                data.percentage = Math.round((data.total.exp / data.total.inc) * 100);
                
            }else{
                data.percentage = -1;
            }
           

        },
        getBudget: function(){
            return {
                budget: data.budget,
                totalinc: data.total.inc,
                totalexp: data.total.exp,
                percentage: data.percentage
            }

        },
        testing: function(){
            console.log(data);
        }
    }
})();


//ui controller
var UIController = (function() {
 var DOMstrings = {
     inputType: '.add__type',
     inputDescription: '.add__description',
     inputValue: '.add__value',
     inputBtn:  '.add__btn',
     incomeContainer: '.income__list',
     expenseContainer: '.expenses__list',
     budgetLabel: '.budget__value',
     incomeLabel: '.budget__income--value',
     expenseLabel: '.budget__expenses--value',
     percentageLabel: '.budget__expenses--percentage',
     container: '.container',
     
 };
    return{
        getinput: function(){
            return{
                type: document.querySelector(DOMstrings.inputType).value,// either inc or exp
               description:  document.querySelector(DOMstrings.inputDescription).value,
               value: parseFloat( document.querySelector(DOMstrings.inputValue).value)
            }
            
        },
        addListItem: function(obj, type){
        var html, newHtml, element
          //create html string with plaholder text
          if(type === 'inc'){
              element = DOMstrings.incomeContainer;
            html = `<div class="item clearfix" id="inc-%id%">
                 <div class="item__description">%description%</div>
                 <div class="right clearfix">
                    <div class="item__value">%value%</div>
                        <div class="item__delete">
                            <button class="item__delete--btn">
                                <i class="ion-ios-close-outline"></i>
                            </button>
                        </div>
                    </div>
                </div>`

          }
         else if(type === 'exp'){
            element = DOMstrings.expenseContainer;
            html = `<div class="item clearfix" id="exp-%id%">
            <div class="item__description">%description%</div>
            <div class="right clearfix">
                <div class="item__value">%value%</div>
                <div class="item__percentage">21%</div>
                <div class="item__delete">
                    <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                </div>
            </div>
        </div>`       

         }

                 


          //replace the placeholder text with some actual data
          newHtml = html.replace('%id%', obj.id);
          newHtml = newHtml.replace('%description%', obj.description);
          newHtml = newHtml.replace('%value%', obj.value);

          //insert the html int
          document.querySelector(element).insertAdjacentHTML('beforeend', newHtml)
        },
        clearFields: function(){
            var fields, fieldsArray
            fields = document.querySelectorAll(DOMstrings.inputDescription + ',' +DOMstrings.inputValue);

             fieldsArray =  Array.prototype.slice.call(fields);

             fieldsArray.forEach(function(current, index, array){
                  current.value = '';
             })
        },
        deleteListItem: function(id){
            var el = document.getElementById(id)
           el.parentNode.removeChild(el);
        }
        ,
        displayBudget: function(obj){
            document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalinc;
            document.querySelector(DOMstrings.expenseLabel).textContent = obj.totalexp;
           
         if(obj.percentage > 0){
            document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage;
         }
         else{
            document.querySelector(DOMstrings.percentageLabel).textContent = '---'
         }

        },

        getDOMstrings: function(){
            return DOMstrings
        }
    }

})();


//global app controller
var controller = (function(budgetCont, UICont){
    var setupEventListener = function(){
        var DOM = UICont.getDOMstrings()
        document.querySelector(DOM.inputBtn).addEventListener('click' , ctrlAddItem);

        document.addEventListener('keypress', function(event){
            //console.log(event);
             if(event.keyCode === 13 || event.which === 13){
                 //console.log('ENTER was pressed')
                 ctrlAddItem();
    
             }
        });
       document.querySelector(DOM.container).addEventListener('click',ctrlDeleteItem)

    }
    var updateBudget = function(){
         // 4. Calculate the budget
         budgetCont.calculateBudget();
         // return the budget
         var budget = budgetCont.getBudget();

        // 5. Display the budget on the UI
        //console.log(budget)
        UICont.displayBudget(budget)
    }
   
    var ctrlAddItem  = function(){
        var input, newItem
        // 1. Get the filed input data
         input = UICont.getinput();
        //console.log(input)
        if(input.description !== '' && !isNaN(input.value) && input.value > 0){
        // 2. Add the item to the budget controller
         newItem = budgetCont.addItems(input.type, input.description, input.value);
         // 3. Add the item to the UI
         UICont.addListItem(newItem, input.type);
 
         //clear the fields
         UICont.clearFields();
 
         // 4. Calculate and update the budget
         updateBudget();

        }
       
     

    };

    var ctrlDeleteItem = function(event){
        var itemId,type, splitID,ID;
       itemId =(event.target.parentNode.parentNode.parentNode.parentNode.id);
       if(itemId){
           splitID = itemId.split('-')// split an elelent into an array 'inc-1' = ['inc', '1'];
           type = splitID[0];
           ID = parseInt(splitID[1]);

           //1. delete the item from data structure
           budgetCont.deleteItem(type, ID);

           //2. delete item from the Ul
           UICont.deleteListItem(itemId);

           //3 update and show the new budget
           updateBudget();
       }

    }
    return{
        intit: function(){
            console.log( 'application has started');
            UICont.displayBudget({
                budget: 0,
                totalinc: 0,
                totalexp: 0,
                percentage: -1,
            })
            setupEventListener();
        }
    }
   

})(budgetController, UIController);

controller.intit()