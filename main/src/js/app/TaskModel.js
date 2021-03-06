/*jslint browser: true es5: true*/
/*global DataAccess, Sql, SeedData, bb, log, console, UIConfig, UIFragments, Util, $, jQuery, UIListController, UIMetaUtil*/
var TaskModel = (function () {
    "use strict";

    return {
	constructTaskObj : function (id, name, gtdList, project, contexts,
                                 dueDate, reminderMetaName, reminderDate, displayReminderIcon) {
        return {
            'id'                  : id,
            'name'                : name,
            'gtdList'             : gtdList,
            'project'             : project,
            'contexts'            : contexts,
            'dueDate'             : dueDate,
            'reminderDate'        : reminderDate,
            'reminderMetaName'    : reminderMetaName,
            'displayReminderIcon' : displayReminderIcon
        };
	}
    };
}());
