//= require 'data-tables/jquery.dataTables'
//= require 'data-tables/DT_bootstrap'

var EditableTable = function() {

  return {

    //main function to initiate the module
    init: function() {
      $("tbody").show();

      function restoreRow(oTable, nRow) {
        var aData = oTable.fnGetData(nRow);
        var jqTds = $('>td', nRow);

        for (var i = 0, iLen = jqTds.length; i < iLen; i++) {
          oTable.fnUpdate(aData[i], nRow, i, false);
        }

        oTable.fnDraw();
      }

      function editRow(oTable, nRow, id) {
        var aData = oTable.fnGetData(nRow);
        var jqTds = $('>td', nRow);
        jqTds[0].innerHTML = '<input type="text" class="form-control small" value="' + aData[0] + '">';
        jqTds[1].innerHTML = '<input type="text" class="form-control small" value="' + aData[1] + '">';
        jqTds[2].innerHTML = '<select class="form-control" selected=' + aData[2] + '>\
                                <option value="男" ' + (aData[2] == '男' ? "selected" : "") + '>男</option>\
                                <option value="女" ' + (aData[2] == '女' ? "selected" : "") + '>女</option>\
                              </select>';
        jqTds[3].innerHTML = '<input type="text" class="form-control small" value="' + aData[3] + '">';
        jqTds[4].innerHTML = '<input type="text" class="form-control small" value="' + aData[4] + '">';
        jqTds[6].innerHTML = '<a class="edit" href="">保存</a>';
        if (id) $(jqTds[6]).find("a.edit").attr("data-id", id);
        jqTds[7].innerHTML = '<a class="cancel" href="">取消</a>';
      }

      function saveRow(oTable, nRow, id) {
        var jqInputs = $('input, select', nRow);
        type = id ? 'PATCH' : "POST";
        url = id ? ('/drivers/' + id) : '/drivers';
        var data = {};
        console.log(jqInputs)
        if (jqInputs[0].value) data['driver[name]'] = jqInputs[0].value;
        if (jqInputs[1].value) data['driver[tel]'] = jqInputs[1].value;
        if (jqInputs[2].value) data['driver[gender]'] = jqInputs[2].value;
        if (jqInputs[3].value) data['driver[age]'] = jqInputs[3].value;
        if (jqInputs[4].value) data['driver[join_time]'] = jqInputs[4].value;
        $.ajax({
          url: url,
          data: data,
          type: type,
          dataType: 'JSON',
          success: function(res) {
            oTable.fnUpdate(res.name, nRow, 0, false);
            oTable.fnUpdate(res.tel, nRow, 1, false);
            oTable.fnUpdate(res.gender, nRow, 2, false);
            oTable.fnUpdate(res.age, nRow, 3, false);
            oTable.fnUpdate(res.join_time, nRow, 4, false);
            oTable.fnUpdate(res.orders_count, nRow, 5, false);
            oTable.fnUpdate('<a class="edit" href="" data-id=' + res.id + '>编辑</a>', nRow, 6, false);
            oTable.fnUpdate('<a class="delete" href="" data-id=' + res.id + '>删除</a>', nRow, 7, false);
            oTable.fnDraw();
          },
          error: function(err) {
            if (id) {
              alert("修改失败!");
              cancelEditRow(oTable, nRow);
            } else {
              alert("创建失败!");
              oTable.fnDeleteRow(nRow);
            }
          }
        })
      }

      function cancelEditRow(oTable, nRow) {
        var jqInputs = $('input', nRow);
        // oTable.fnUpdate(jqInputs[0].value, nRow, 0, false);
        oTable.fnUpdate('<a class="edit" href="">编辑</a>', nRow, 3, false);
        oTable.fnUpdate('<a class="delete" href="">取消</a>', nRow, 4, false);
        oTable.fnDraw();
      }

      var oTable = $('#editable-sample').dataTable({
        "aLengthMenu": [
          [5, 15, 20, -1],
          [5, 15, 20, "所有"] // change per page values here
        ],
        // set the initial value
        "iDisplayLength": 5,
        "sDom": "<'row'<'col-lg-6'l><'col-lg-6'f>r>t<'row'<'col-lg-6'i><'col-lg-6'p>>",
        "sPaginationType": "bootstrap",
        "oLanguage": {
          "sLengthMenu": "_MENU_ 条记录/页",
          "oPaginate": {
            "sPrevious": "上一页",
            "sNext": "下一页"
          }
        },
        "aoColumnDefs": [{
          'bSortable': false,
          'aTargets': [0]
        }]
      });

      jQuery('#editable-sample_wrapper .dataTables_filter input').addClass("form-control medium"); // modify table search input
      jQuery('#editable-sample_wrapper .dataTables_length select').addClass("form-control xsmall"); // modify table per page dropdown

      var nEditing = null;

      $('#editable-sample_new').click(function(e) {
        e.preventDefault();
        var aiNew = oTable.fnAddData(['', '', '', '', '', '',
          '<a class="edit" href="">保存</a>', '<a class="cancel" data-mode="new" href="">取消</a>'
        ]);
        var nRow = oTable.fnGetNodes(aiNew[0]);
        editRow(oTable, nRow);
        nEditing = nRow;
      });

      $('#editable-sample').on('click', 'a.delete', function(e) {
        e.preventDefault();

        if (confirm("确定删除该条记录 ?") == false) {
          return;
        }

        var nRow = $(this).parents('tr')[0];

        $.ajax({
          url: '/drivers/' + $(this).data("id"),
          type: 'delete',
          dataType: 'JSON',
          success: function(res) {
            oTable.fnDeleteRow(nRow);
          },
          error: function(err) {
            // for(var i in err) alert(err[i]);
            alert("删除失败,无法删除司机信息!");
          }
        })

      });

      $('#editable-sample').on('click', 'a.cancel', function(e) {
        e.preventDefault();
        if ($(this).attr("data-mode") == "new") {
          var nRow = $(this).parents('tr')[0];
          oTable.fnDeleteRow(nRow);
        } else {
          restoreRow(oTable, nEditing);
          nEditing = null;
        }
      });

      $('#editable-sample').on('click', 'a.edit', function(e) {
        e.preventDefault();

        /* Get the row as a parent of the link that was clicked on */
        var nRow = $(this).parents('tr')[0];

        if (nEditing !== null && nEditing != nRow) {
          /* Currently editing - but not this row - restore the old before continuing to edit mode */
          // restoreRow(oTable, nEditing);
          editRow(oTable, nRow, $(this).data("id"));
          nEditing = nRow;
        } else if (nEditing == nRow && this.innerHTML == "保存") {
          /* Editing this row and want to save it */
          saveRow(oTable, nEditing, $(this).data("id"));
          nEditing = null;
        } else {
          /* No edit in progress - let's start one */
          editRow(oTable, nRow, $(this).data("id"));
          nEditing = nRow;
        }
      });
    }
  };
}();
