$(document).ready(function() {
  let rowsShown = 5;  
  $('.items_show').html(rowsShown)
   // Activate tooltip
  $('[data-toggle="tooltip"]').tooltip();
              
  // Select/Deselect checkboxes
  $("#selectAll").click(function(){
      if(this.checked){
        $('.test').each(function(){
            $(this).prop("checked",true);                 
          });
      } else{
        $('.test').each(function(){
            $(this).prop("checked",false);      
          });
      } 
  });
  $(document).on('click','.test',function(e){
      if(!$(this).checked){
          $("#selectAll").prop("checked", false);
      }
  });
   //Call data Api 
  $.ajax({
    type: "GET",
    url: "https://63a56082318b23efa791bf88.mockapi.io/api/crud",
    success: function(data){
      let rowsTotal = data.length

      $('.total_items').html(rowsTotal)    
      renderData(data, rowsTotal);
    }
  });

  //Render Data in web
  function renderData(data, rowsTotal){
    let newData = data.reverse().slice(0, rowsShown);
    let numPages = Math.ceil(rowsTotal/rowsShown);  

    templateDataa(newData)
    pagination(1, numPages, 1)
    
    $(document).on('click','.pagination a',function(e){
      e.preventDefault()
      let currPage = $(this).attr('rel');  
      let startItem = currPage * rowsShown;  
      let endItem = startItem + rowsShown;  
      newData = data.slice(startItem, endItem)
      $('.page-link').removeClass('active');
      $(this).not('.next-all').addClass('active');  
      

      $('.table  tbody tr').remove()
      templateDataa(newData)
      pagination(currPage , numPages, 1)
    });  
  }

  // add value item to popup edit
  $(document).on('click','.fillData',function(e){
    e.preventDefault()
    let idEdit = $(this).attr('id')
    $.ajax({
      type: "GET",
      url: `https://63a56082318b23efa791bf88.mockapi.io/api/crud/${idEdit}`,
      success: function(data){
          let dataShow = 
          `
            <div class="modal-content">
                <div class="modal-header">						
                    <h4 class="modal-title">Edit ${data.name}</h4>
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                </div>
                <div class="modal-body">					
                    <div class="form-group">
                        <label>Name</label>
                        <input id="name" type="text" value="${data.name}" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label>Price</label>
                        <input id="price" type="number" value="${data.price}" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label>QR</label>
                        <input id="qr" type="text" value="${data.qr}" class="form-control" required>
                    </div>
                </div>
                <div class="modal-footer">
                    <input type="button" class="btn btn-default" data-dismiss="modal" value="Cancel">
                    <input id="${data.id}" type="submit" class="btn btn-info js-add" data-action="PUT" value="Update">
                </div>
            </div>
          `;  
          $("#addEmployeeModal .modal-dialog").empty();                      
          $("#addEmployeeModal .modal-dialog").append(dataShow);            
        }
    });

  });

  // Delete value one item and all item
  $(document).on('click','.js-delete',function(e){
    e.preventDefault()
    let arrID = []
    let style = $(this).data('style')
    if(style){
      $('.test').each(function(){
        if($(this).is(":checked")){
            arrID.push($(this).val())
        }
      });
    }
    else{
      arrID.push($(this).attr('id'))
    }
    if (confirm("Are you sure you want to delete these Records?")) {
      $.each(arrID, function( key, val ) {
        $.ajax({
          url: `https://63a56082318b23efa791bf88.mockapi.io/api/crud/${val}`,
          type: 'DELETE',
          success: function(data) {        
            $('#deleteEmployeeModal').hide()
            $('#rows'+val).remove()
          }
        });
      });
    }
  });

  // change and add val 
  $(document).on('click','.js-add',function(){ 
    let name = $("#name").val(); 
    let qr = $("#addEmployeeModal #qr").val();
    let price = $("#price").val(); 
    let action = $(this).data('action');
    let url = "https://63a56082318b23efa791bf88.mockapi.io/api/crud";

    if(action === "PUT"){
      let id = $(this).attr('id'); 
      url = `https://63a56082318b23efa791bf88.mockapi.io/api/crud/${id}`;
    }

    $.ajax({
      type: action,
      url,
      data: {
        name,
        qr,
        price
      },
      success: function (data){    
          window.location.reload();
        }
    });

  }); 

});

// templateDataa 
function templateDataa(arr){
  $.each(arr, function( index, val ) {
    let dataShow = 
    `
      <tr id="rows${val.id}">
        <td>
            <span class="custom-checkbox">
                <input type="checkbox" id="checkbox${index}" name="options[]" class="test" value="${val.id}">
                <label for="checkbox${index}"></label>
            </span>
        </td>
        <td>${val.name}</td>
        <td>${val.price}</td>
        <td>${val.qr}</td>
        <td>${val.id}</td>
        <td>
            <a id="${val.id}" href="#addEmployeeModal" class="edit fillData" data-toggle="modal"><i class="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i></a>
            <a id="${val.id}" href="#deleteEmployeeModal" class="delete js-delete" data-toggle="modal"><i class="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i></a>
        </td>
      </tr>
    `;  
    $(".table-striped tbody").append(dataShow);
  });  
}

// pagination 
function pagination(currentPage, totalPage, numberShow){
  currentPage = currentPage ? currentPage : 1;
  let minus = parseInt(currentPage) - parseInt(numberShow);
  let plus = parseInt(currentPage) + parseInt(numberShow);
  let moreMinus = 0;
  let morePlus = 0;
  let currentMinus = (currentPage - 1) > 1 ? (currentPage - 1) : 1 ;
  let currentPlus;
  if(currentPage <= totalPage){
      currentPlus = parseInt(currentPage) + 1;
  }else{
      currentPlus = totalPage;
  }

  $('.pagination').empty();
  if(currentPage > 1){
    $('.pagination').prepend(`<a href="#" rel="1" class="page-link next-all"><i class="fa fa-angle-double-left" aria-hidden="true"></i></a>`);  
    $('.pagination').append('<a href="#" rel="'+currentMinus+'"><i class="fa fa-angle-left" aria-hidden="true"></i></a>');
  }
  for(let i = 1; i<=totalPage;i++){
      if(i == currentPage || !currentPage && i == 1){
          $('.pagination').append('<a href="#"  rel="'+i+'" class="page-link">'+i+'</a>');
      }else if((minus - 1) <= i && i < currentPage){
          if(minus >= 3 && moreMinus == 0){
              $('.pagination').append('<a href="#" rel="1">1</a>');
          }
          if(moreMinus == 0 && minus > 2){
              $('.pagination').append('<span class="curent">...</span>');
              moreMinus++;
          }else{
              $('.pagination').append('<a href="#" rel="'+i+'">'+i+'</a>');
          }
      }else if(i > currentPage) {
          if(plus >= i && i > currentPage){
              $('.pagination').append('<a href="#" rel="'+i+'">'+i+'</a>');
          }else if(i != totalPage && plus < totalPage && morePlus == 0){
              $('.pagination').append('<span class="curent">...</span>');
              morePlus++;
          }else if(i === totalPage){
              $('.pagination').append('<a href="#" rel="'+totalPage+'">'+totalPage+'</a>');
              
          }
      }
  }
  if(currentPage < totalPage){
      $('.pagination').append('<a href="javascript:void(0)" rel="'+currentPlus+'"><i class="fa fa-angle-right" aria-hidden="true"></i></a>');
      $('.pagination').append(`<a href="#" rel="${totalPage}" class="page-link next-all"><i class="fa fa-angle-double-right" aria-hidden="true"></i></a>`);  
  }
  
}