function filterTasksToGroupList(groupWidth,taskWidth,taskLeft, metaTypeName, metaName) {
    document.getElementById('group').style.width=groupWidth;
    document.getElementById(uiConfig.detailListElementId).style.width=taskWidth;
    document.getElementById(uiConfig.detailListElementId).style.left=taskLeft + 'px';
    if(null != metaTypeName && null != metaName) {
      //Fill in tasks.      
    }
}
function addTaskToList (id, name, project, tags) {
    var item, taskList;
    item = createItemElement(id, name, project, tags);
    taskList = document.getElementById(uiConfig.detailListElementId);
    taskList.appendItem(item, taskList[0]);
}
function addAllTaskToList () {
    var id, name;
    dataAccess.task.getAll(function(transaction, results, arrays){
        if(null == arrays || undefined == arrays || 0 == arrays.length){
            taskList = document.getElementById(uiConfig.detailListElementId);
            taskList.innerHTML = '<center><br/>Wow, great, all tasks are done, you could play with your family or friends</center>';
        } else {
            for(var key in arrays) {   
                name = arrays[key][SQL.TASK.COLS.NAME];
                id   = arrays[key][SQL.TASK.COLS.ID];
                addTaskToList(id, name, "Project", "@中文 @Call @Tag2");    
            }
        }
    }, function(transaction, error){
        console.error("Error to get task " + error);
    });
}

function createItemElement(id, name, project, tags) {
    var item = document.createElement('div');
    item.setAttribute('data-bb-type','item');
    item.setAttribute('data-bb-style','stretch');
    if(id != null) {
        item.setAttribute('id', 'task-' + id);
        if(project != null){
            item.setAttribute('data-bb-accent-text', project);
        }
        if (name != null) {                     
            item.setAttribute('title', name);
            item.setAttribute('data-bb-title',name);
        }
        if (tags != null) {
            item.innerHTML = tags;
        }
        item.onclick = function() {
            document.getElementById('task-operation-context-menu').menu.show({
                title:'Edit Task',
                description : name, 
                selected : id,
            });
        };    
    }
    return item;
}
function dialogCallBack(index){
    alert(index);
}
function customDialog(taskName) {
    try {
        var buttons = ["Done!", "Postpone :(", "Open Task"];
            var ops = {title : "Peaceful & Better Life's Reminder", size : "large", position : "middleCenter"};
            blackberry.ui.dialog.customAskAsync(taskName, buttons, dialogCallBack, ops);
    } catch(e) {
        console.error("Exception in customDialog: " + e);
    }
}
function fillTaskToEditForm(id){
    dataAccess.task.getById(id, function(tx, result, arrays) {
        document.getElementById('task-id').value = id;
        document.getElementById('task-name').value = arrays[0][SQL.TITLE.COLS.NAME];
    }, function(tx, error) {
        //TODO Move to a common method
        bb.pushScreen('error.html', 'error-page'); 
    });
}
function fillMetaListToPanel(metaTypeId, pageType){
    var metaTypeIdInput = document.getElementById('meta_type_id'), metaTypeName, metaList = document.getElementById('meta-list');
    metaList.clear();
    if(undefined != metaTypeIdInput) {
        metaTypeIdInput.value = metaTypeId;
    }
    dataAccess.metaType.getById(metaTypeId, function(tx, result, objs){
        if(objs != null && objs != undefined && objs[0] != undefined){
            metaTypeName = objs[0][SQL.META_TYPE.COLS.NAME];
            console.log(metaTypeName);
            document.getElementById('add-new-link').innerText = 'Add New ' + metaTypeName;
        }
    }, function(tx, error){
        bb.pushScreen('error.html', 'error-page'); 
    });
    dataAccess.meta.getByTypeId(metaTypeId, function(tx, result, arrays){
        for(var key in arrays){   
            name = arrays[key][SQL.META.COLS.NAME];
            id   = arrays[key][SQL.META.COLS.ID];
            desc = arrays[key][SQL.META.COLS.DESCRIPTION];
            console.log("Meta id: " + id + ", name: " + name + ", description: " + desc);
            var item = document.createElement('div');
            item.setAttribute('data-bb-type','item');
            item.setAttribute('data-bb-style','stretch');
            if(id != null) {
                item.setAttribute('id', 'meta-' + id);
                if (name != null) {                     
                    item.setAttribute('title', name);
                    item.setAttribute('data-bb-title',name);
                }
                if(uiConfig.taskByPagePrefix == pageType){ 
                    item.onclick = function() {
                        filterTasksToGroupList(
                            uiConfig.leftPanelWidth, 
                            uiConfig.rightPanelWidth, 
                            uiConfig.rightPanelSmallerLeftMargin,
                            metaTypeName,
                            name
                        );
                    };    
                } else if (uiConfig.metaByPagePrefix == pageType){
                    if(desc != null && desc != undefined){
                        item.innerHTML = desc;
                    }
                    item.setAttribute(
                        'onclick', 
                        "document.getElementById('meta-operation-context-menu').menu.show({ title : '" + name + "', description : '" + metaTypeName + "', selected : '" + id + "'});");
                }
            }
            metaList.appendItem(item);
        }
    }, function(tx, error){
        bb.pushScreen('error.html', 'error-page'); 
    });
}
//TODO Remove this method and all change to fillMetaListToPanel(metaTypeId, pageType) method invoking
function fillMetaListToPanelByTypeName(metaTypeName, pageType){
    dataAccess.metaType.getByName(metaType, function(tx, result, objs){
        fillMetaListToPanel(objs[0][SQL.META_TYPE.COLS.ID], pageType);
    }, function(tx, error){
        bb.pushScreen('error.html', 'error-page'); 
    })
}
function fillMetaTypeToPanel (){
    var item, name;
    metaTypeList = document.getElementById('meta-type-list');
    dataAccess.metaType.getAll(function(tx, result, arrays){
        for(var key in arrays){   
            name = arrays[key][SQL.META_TYPE.COLS.NAME];
            id   = arrays[key][SQL.META_TYPE.COLS.ID];
            desc = arrays[key][SQL.META_TYPE.COLS.DESCRIPTION];
            console.log("Meta type id: " + id + ", name: " + name + ", description: " + desc);
            item = document.createElement('div');
            item.setAttribute('data-bb-type','item');
            item.setAttribute('data-bb-style','stretch');
            if(id != null && name != 'GTD') {
                item.setAttribute('id', 'meta_type-' + id);
                if (name != null) {                     
                    item.setAttribute('title', name);
                    item.setAttribute('data-bb-title',name);
                }
                item.setAttribute(
                    'onclick', 
                    "fillMetaListToPanel('" + id + "', '" + uiConfig.metaByPagePrefix + "');filterTasksToGroupList('" + uiConfig.leftPanelWidth + "', '" + uiConfig.rightPanelWidth +"', '" + uiConfig.rightPanelSmallerLeftMargin +"');"
                );
                metaTypeList.appendItem(item);
            }
        }
    }, function(tx, error){
        bb.pushScreen('error.html', 'error-page'); 
    });
}
function fillTasksToPanel(metaTypeName){

}
function fillMetaToEditForm(id){
    if(id != null && id != undefined){
        dataAccess.meta.getById(id, function(tx, results, arrays){
            log.logObjectData("Meta", arrays[0], true);
            document.getElementById(SQL.META.COLS.ID).value = arrays[0][SQL.META.COLS.ID];
            document.getElementById(SQL.META.COLS.NAME).value = arrays[0][SQL.META.COLS.NAME];
            document.getElementById(SQL.META.COLS.DESCRIPTION).value = arrays[0][SQL.META.COLS.DESCRIPTION];
            dataAccess.metaType.getById(arrays[0][SQL.META.COLS.META_TYPE_ID], function(tx,result, objs){
                document.getElementById('meta_type_name').value = objs[0][SQL.META_TYPE.COLS.NAME];
                document.getElementById('meta_type_id').value = objs[0][SQL.META_TYPE.COLS.ID];
            });
        }, function(tx, error) {
            bb.pushScreen('error.html', 'error-page'); 
        });
    }
}
function fillMetaToCreateForm(meta_type_id) {
    dataAccess.metaType.getById(meta_type_id, function(tx,result, objs){
        document.getElementById('meta_type_name').value = objs[0][SQL.META_TYPE.COLS.NAME];
        document.getElementById('meta_type_id').value = objs[0][SQL.META_TYPE.COLS.ID];
    });
}
