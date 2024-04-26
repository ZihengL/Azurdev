const local_storage_lib = {
  local_storage_root_key: "com_adazur",

  getRoot: function () {
    var ls_obj = {};
    if (typeof Storage !== "undefined") {
      var saved_str = window.localStorage.getItem(
        local_storage_lib.local_storage_root_key
      );
      try {
        ls_obj = saved_str ? JSON.parse(saved_str) : {};
      } catch (err) {
        ls_obj = {};
      }
    }
    return ls_obj || {};
  },

  branch: function (affected_branch, value, b_remove) {
    var prs_branch = affected_branch.split(".") || [];
    if (value) {
      // store value to branch
      var tmp_arr = [];
      for (var i = 0; i < prs_branch.length; i++) {
        var pushobj = {};
        pushobj[prs_branch[i]] = i == prs_branch.length - 1 ? value || "" : {};
        tmp_arr.push(pushobj);
      }
      for (var i = prs_branch.length - 1; i > 0; i--)
        tmp_arr[i - 1][prs_branch[i - 1]] = tmp_arr[i];
      var whole_stored_data = local_storage_lib.getRoot();
      for (var bkey in tmp_arr[0]) whole_stored_data[bkey] = tmp_arr[0][bkey];
      if (b_remove) delete whole_stored_data[prs_branch[0]];
      window.localStorage.setItem(
        local_storage_lib.local_storage_root_key,
        JSON.stringify(whole_stored_data)
      );
    } // no value to store? Then return existing value
    else {
      var crr_val = local_storage_lib.getRoot()[prs_branch[0]] || {};
      for (i = 1; i < prs_branch.length; i++)
        if (crr_val[prs_branch[i]]) crr_val = crr_val[prs_branch[i]];
        else return;
      return crr_val;
    }
  },

  delete_branch: function (affected_branch) {
    local_storage_lib.branch(affected_branch, "dummy_value", true);
  },
};
