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
        jqTds[0].innerHTML = '<input type="text" class="form-control small" value="' + $(aData[0]).text() + '">';
        jqTds[1].innerHTML = '<input type="text" class="form-control small" value="' + aData[1] + '">';
        jqTds[2].innerHTML = '<input type="text" class="form-control small" value="' + aData[2] + '">';
        jqTds[3].innerHTML = '<input type="text" class="form-control small" value="' + aData[3] + '">';
        jqTds[4].innerHTML = '<select class="form-control" selected=' + aData[4] + '>\
                                <option value="正常" ' + (aData[4] == '正常' ? "selected" : "") + '>正常</option>\
                                <option value="维修中" ' + (aData[4] == '维修中' ? "selected" : "") + '>维修中</option>\
                                <option value="调离" ' + (aData[4] == '调离' ? "selected" : "") + '>调离</option>\
                                <option value="报废" ' + (aData[4] == '报废' ? "selected" : "") + '>报废</option>\
                              </select>';
        jqTds[5].innerHTML = '<input type="text" class="form-control small" value="' + aData[5] + '">';
        jqTds[6].innerHTML = '<a class="edit" href="">保存</a>';
        if (id) $(jqTds[6]).find("a.edit").attr("data-id", id);
        jqTds[7].innerHTML = '<a class="cancel" href="">取消</a>';
      }

      function saveRow(oTable, nRow, id) {
        var jqInputs = $('input, select', nRow);
        type = id ? 'PATCH' : "POST";
        url = id ? ('/car_bodies/' + id) : '/car_bodies';
        var data = {};
        console.log(jqInputs)
        if (jqInputs[0].value) data['car_body[body_id]'] = jqInputs[0].value;
        if (jqInputs[1].value) data['car_body[body_type]'] = jqInputs[1].value;
        if (jqInputs[2].value) data['car_body[brand]'] = jqInputs[2].value;
        if (jqInputs[3].value) data['car_body[max_weight]'] = jqInputs[3].value;
        if (jqInputs[4].value) data['car_body[status]'] = jqInputs[4].value;
        if (jqInputs[5].value) data['car_body[loc]'] = jqInputs[5].value;
        $.ajax({
          url: url,
          data: data,
          type: type,
          dataType: 'JSON',
          success: function(res) {
            oTable.fnUpdate(res.body_id, nRow, 0, false);
            oTable.fnUpdate(res.body_type, nRow, 1, false);
            oTable.fnUpdate(res.brand, nRow, 2, false);
            oTable.fnUpdate(res.max_weight, nRow, 3, false);
            oTable.fnUpdate(res.status, nRow, 4, false);
            oTable.fnUpdate(res.loc, nRow, 5, false);
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
        oTable.fnUpdate('<a class="edit" href="">编辑</a>', nRow, 6, false);
        oTable.fnUpdate('<a class="delete" href="">取消</a>', nRow, 7, false);
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
        var aiNew = oTable.fnAddData(['', '', '', '', '正常', '',
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
          url: '/car_bodies/' + $(this).data("id"),
          type: 'delete',
          dataType: 'JSON',
          success: function(res) {
            oTable.fnDeleteRow(nRow);
          },
          error: function(err) {
            // for(var i in err) alert(err[i]);
            alert("删除失败,无法删除挂车信息!");
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
