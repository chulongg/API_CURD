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
    let newData = data.slice(0, rowsShown);
    let numPages = Math.ceil(rowsTotal/rowsShown);  
    // How many pages can be around the current page
    let maxAround = 1;
    // How many pages are displayed if in beginning or end range
    let maxRange = 3;
    // The current page (pass this however you like)
    let currentPage = 1;

    let endRange = numPages - maxRange;
    console.log("endRange: "+endRange)
    // Check if we're in the starting section
    let inStartRange = currentPage <= maxRange;
    // Check if we're in the ending section
    let inEndRange = currentPage >= endRange;
    console.log("inEndRange: "+inEndRange)
     // We need this for the span(s)
    let lastDotIndex = -1;

    currentPage > 1 ? disable = "disable1" : disable="";
    for (i = 0;i < numPages;i++) {  
      var pageNum = i + 1; 
      let active = "";
      let disable = "";
      i === 0 ? active = "active" : active="";
      if(i === 0){
        $('.pagination').prepend(`<li class="page-item ${disable}"><a href="#" rel="${i}" class="page-link prev-all next-all disable">Prev All</a></li>`);  
      }
      if(i === 0 || i === (numPages-2)){
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
      if(currPage > 0){
        $('.prev-all').removeClass('disable')
      }
      else{
        $('.prev-all').addClass('disable')
      }
      $('.table  tbody tr').remove()
      $.each(newData, function( index, val ) {
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
              <a id="${val.id}" href="#editEmployeeModal" class="edit" data-toggle="modal"><i class="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i></a>
              <a id="${val.id}" href="#deleteEmployeeModal" class="delete" data-toggle="modal"><i class="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i></a>
          </td>
        </tr>`;  
        $(".table-striped tbody").append(dataShow);
      });    
    });  
    $.each(newData, function( index, val ) {
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
            <a id="${val.id}" href="#editEmployeeModal" class="edit" data-toggle="modal"><i class="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i></a>
            <a id="${val.id}" href="#deleteEmployeeModal" class="delete js-delete"><i class="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i></a>
        </td>
      </tr>`;  
      $(".table-striped tbody").append(dataShow);
    });    
  }

  $(document).on('click','.del_all',function(e){
    let arrID = []
    if (confirm("Are you sure you want to delete these Records?")) {
      $('.test').each(function(){
        if($(this).is(":checked")){
          arrID.push($(this).val())
            $.each( arrID, function( key, val ) {
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
    }
  });
  // add value item to popup edit
  $(document).on('click','.edit',function(e){
    e.preventDefault()
    let idEdit = $(this).attr('id')
    
    $.ajax({
      type: "GET",
      url: "https://63a56082318b23efa791bf88.mockapi.io/api/crud",
      success: function(data){
          $.each(data, function( index, val ) {
            if( idEdit == val.id){
              let dataShow = `
              <div class="modal-content">
                  <div class="modal-header">						
                      <h4 class="modal-title">Edit ${val.name}</h4>
                      <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                  </div>
                  <div class="modal-body">					
                      <div class="form-group">
                          <label>Name</label>
                          <input id="name" type="text" value="${val.name}" class="form-control" required>
                      </div>
                      <div class="form-group">
                          <label>Price</label>
                          <input id="price" type="number" value="${val.price}" class="form-control" required>
                      </div>
                      <div class="form-group">
                          <label>QR</label>
                          <input id="qr" type="text" value="${val.qr}" class="form-control" required>
                      </div>
                  </div>
                  <div class="modal-footer">
                      <input type="button" class="btn btn-default" data-dismiss="modal" value="Cancel">
                      <input id="${val.id}" type="submit" class="btn btn-info js-update" value="Update">
                  </div>
            </div>`;  
              $("#editEmployeeModal .modal-dialog").empty();                      
              $("#editEmployeeModal .modal-dialog").append(dataShow);            
            }             
          });  
        }
    });

  });

  $(".js-add").click(function() {  
    let valueQr = $("#qr").val();
    let valueName = $("#name").val(); 
    let valuePrice = $("#price").val(); 
    //function load_ajax()-> add values in Data api
    function load_ajax_add() {
      //post value ajax api
      $.ajax({
        type: "POST",
        url: "https://63a56082318b23efa791bf88.mockapi.io/api/crud",
        data: {
          qr: valueQr,
          name: valueName,
          price: valuePrice
        },
        success: function (data){          
          // Note: Click add Value  -> reload page -> render page have new data
            window.location.reload();
         }
      });
    }
    load_ajax_add();
  }); 

  // Delete value
  $(document).on('click','.js-delete',function(e){
    e.preventDefault()
    let idDelete= $(this).attr('id');  
    let $this = $(this);  
    if (confirm("Are you sure you want to delete these Records?")) {
      $.ajax({
        url: `https://63a56082318b23efa791bf88.mockapi.io/api/crud/${idDelete}`,
        type: 'DELETE',
        success: function(data) {        
          $this.parents().remove('tr');
          $('#deleteEmployeeModal').hide()
          $('#rows'+idDelete).remove()
        }
      });
    }
  });

  // Edit value
  $(document).on('click','.js-change',function(){
    let idChange = $(this).attr('id');

    // render data vào lại ô input nhập
    $.ajax({
      type: "GET",
      url: "https://63a56082318b23efa791bf88.mockapi.io/api/crud",
      success: function(data){
          // console.log(idChange);          
          $.each(data, function( index, value ) {
            // console.log(value.id);
            if( idChange == value.id){
              let valueInput = `
              <div class="form_value">
                <div class="fied">
                  <label for="">Ma Sp</label>
                  <input type="text" name="qr" id="qr" value="${value.qr}">
                </div>
                <div class="fied">
                  <label for="">Ten</label>
                  <input type="text" name="name" id="name"  value="${value.name}">
                </div>
                <div class="fied">
                  <label for="">Gia</label>
                  <input type="number" name="price" id="price"  value="${value.price}">
                </div>
              </div>
              <input type="hidden" name="id" id=""  value="${idChange}" class="input__hidden">
              <button class="add_item--btn js-update">Add</button>
              `;  
              $(".form_value").empty();                      
              $(".form_value").append(valueInput);            
            }             
          });  
        }
    });
  });

  $(document).on('click','.js-update',function(){ 
    let QrChange = $("#editEmployeeModal #qr").val();
    let NameChange = $("#editEmployeeModal #name").val(); 
    let PriceChange = $("#editEmployeeModal #price").val(); 
    let idBtnChange = $(this).attr('id'); 
    // console.log(NameChange);
    $.ajax({
      type: "PUT",
      url: `https://63a56082318b23efa791bf88.mockapi.io/api/crud/${idBtnChange}`,
      data: {
        qr:  QrChange,
        name: NameChange,
        price: PriceChange
      },
      success: function (data){   
        window.location.reload();                    
      }
    });
   });
});