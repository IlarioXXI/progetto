$(document).ready(function() {

    load_data();

    function load_data() {
        $.ajax({
            
          type: "GET",
          url: "php-api-crud/api/read.php",
          dataType: "json",
          success: function(data) {
            
      
            var data_arr = [];
      
            $.each(data.body, function(index, employee) {
              var sub_array = {
                'first_name': employee.first_name,
                'last_name': employee.last_name,
                'gender': employee.gender,
                'age': employee.age,
                'action': '</button>&nbsp;<button type="button" class="btn btn-danger btn-sm delete" data-id="' + employee.id + '">Delete</button>'
              };
      
              data_arr.push(sub_array);
            });
      
            $('#sample_data').DataTable({
                data: data_arr,
                order: [],
                columns: [
                  { data: "first_name" },
                  { data: "last_name" },
                  { data: "gender" },
                  { data: "age" },
                  { data: "action" }
                ]
              });
          }
        });
      }
         $('#add_data').click(function() {

        $('#dynamic_modal_title').text('Add Data');

        $('#sample_form')[0].reset();

        $('#action').val('Add');

        $('#action_button').text('Add');

        $('.text-danger').text('');

        $('#action_modal').modal('show');

    });

    $('#sample_form').on('submit', function(event) {

        event.preventDefault();
  
        $.ajax({
            url: "php-api-crud/api/create.php",
            method: "POST",
            data: $('#sample_form').serialize(),
            dataType: "JSON",
            beforeSend: function() {
                $('#action_button').attr('disabled', 'disabled');
            },
            success: function(data) {
                $('#action_button').attr('disabled', false);
                if (data.error) {
                    if (data.error.first_name_error) {
                        $('#first_name_error').text(data.error.first_name_error);
                    }
                    if (data.error.last_name_error) {
                        $('#last_name_error').text(data.error.last_name_error);
                    }
                    if (data.error.age_error) {
                        $('#age_error').text(data.error.age_error);
                    }
                } else {
                    $('#message').html('<div class="alert alert-success">' + data.success + '</div>');

                    $('#action_modal').modal('hide');

                    $('#sample_data').DataTable().destroy();

                    load_data();

                    setTimeout(function() {
                        $('#message').html('');
                    }, 5000);
                }
            }
        });

    });

    $(document).on('click', '.delete', function() {

        var id = $(this).data('id');

        if (confirm("Are you sure you want to delete this data?")) {
            $.ajax({
                url: "php-api-crud/api/delete.php",
                method: "POST",
                data: {
                    action: 'delete',
                    id: id
                },
                dataType: "JSON",
                success: function(data) {
                    $('#message').html('<div class="alert alert-success">' + data.success + '</div>');
                    $('#sample_data').DataTable().destroy();
                    load_data();
                    setTimeout(function() {
                        $('#message').html('');
                    }, 5000);
                }
            });
        }

    });

    $(document).on('click', '.edit', function() {

        var id = $(this).data('id');
        console.log(id);
        $('#dynamic_modal_title').text('Edit Data');

        $('#action').val('Edit');

        $('#action_button').text('Edit');

        $('.text-danger').text('');

        $('#action_modal').modal('show');

        $.ajax({
            url: "php-api-crud/api/update.php",
            method: "POST",
            data: {
                id: id,
                action: 'fetch_single',
                
            },
            dataType: "JSON",
            success: function(data) {
                $('#first_name').val(data.first_name);
                $('#last_name').val(data.last_name);
                $('#gender').val(data.gender);
                $('#age').val(data.age);
                $('#id').val(data.id);
            },
            error: function() {},
            always: function() {
                alert('Ajax completed!')
            }
        });

    });

  
    });

   