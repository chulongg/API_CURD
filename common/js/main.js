$(document).ready(function() {
  let rowsShown = 1;  
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
    templateDataa(newData)

    let numPages = Math.ceil(rowsTotal/rowsShown);  
    // How many pages can be around the current page
    let maxAround = 1;
    // How many pages are displayed if in beginning or end range
    let maxRange = 3;
    // The current page (pass this however you like)
    let currentPage = 1;

    let endRange = numPages - maxRange;
    // Check if we're in the starting section
    let inStartRange = currentPage <= maxRange;
    // Check if we're in the ending section
    let inEndRange = currentPage >= endRange;
     // We need this for the span(s)
    let lastDotIndex = -1;

    currentPage > 1 ? disable = "disable1" : disable="";
    
    
    
    for (i = 0;i < numPages;i++) {  
      var pageNum = i + 1; 
      let active = "";
      let disable = "";
      i === 0 ? active = "active" : active="";
      if(i === 0){
        $('.pagination').prepend(`<li class="page-item ${disable}"><a href="#" rel="${i}" class="page-link next-all">Prev All</a></li>`);  
      }
      if(i === (numPages-2)){
        $('.pagination').append ('<li class="page-item '+active+'"><a href="#"  rel="'+i+'" class="page-link">'+pageNum+'</a></li>');  
      }
      else if (inStartRange && i < maxRange) {
        $('.pagination').append ('<li class="page-item '+active+'"><a href="#"  rel="'+i+'" class="page-link">'+pageNum+'</a></li>');  
      }
      else if (!inEndRange && i >= endRange) {
        $('.pagination').append ('<li class="page-item '+active+'"><a href="#"  rel="'+i+'" class="page-link">'+pageNum+'</a></li>'); 
      }
      else if (i === currentPage - maxAround || i === currentPage || i === currentPage + maxAround) {
        $('.pagination').append ('<li class="page-item '+active+'"><a href="#"  rel="'+i+'" class="page-link">'+pageNum+'</a></li>');
      }
      else {
        if (lastDotIndex === -1 || (!inStartRange && !inEndRange)) {
            lastDotIndex = i;
            $('.pagination').append ('<li class="page-item"><span class="dots">...</span></li>');
        }
    }
      if(i === numPages - 1){
        $('.pagination').append('<li class="page-item"><a href="#" rel="'+(pageNum-1)+'" class="page-link next-all">Next All</a></li>');  
      }
    }  
    $('.page-link').on('click', function(e) {  
      e.preventDefault()
      let currPage = $(this).attr('rel');  
      let startItem = currPage * rowsShown;  
      let endItem = startItem + rowsShown;  
      newData = data.slice(startItem, endItem)
      $('.page-link').parent().removeClass('active');
      $(this).not('.next-all').parent().addClass('active');  
      if ($(this).hasClass('next-all')) {
        let target = $(this).attr('rel')
        $(`.page-link[rel="${target}"]`).not('.next-all').parent().addClass('active');
      }
      $('.table  tbody tr').remove()
      templateDataa(newData)
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
          let dataShow = `
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
          </div>`;  
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
      deleteData(arrID)
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
      url: url,
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

function deleteData(arr){
  $.each(arr, function( key, val ) {
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

function templateDataa(arr){
  $.each(arr, function( index, val ) {
    let dataShow = `
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
    </tr>`;  
    $(".table-striped tbody").append(dataShow);
  });  
}