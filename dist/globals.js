"use strict";
var ListNode = class ListNode {
    constructor(val, next) {
        this.val = (val === undefined ? 0 : val);
        this.next = (next === undefined ? null : next);
    }
};
global.ListNode = ListNode;
