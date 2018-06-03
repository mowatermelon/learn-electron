/*global Vue, todoStorage */

(function (exports) {

	'use strict';

	const {
		remote
	} = require('electron');
	const {
		dialog
	} = remote;

	let filters = {
		all: function (todos) {
			return todos;
		},
		active: function (todos) {
			return todos.filter(function (todo) {
				return !todo.completed;
			});
		},
		completed: function (todos) {
			return todos.filter(function (todo) {
				return todo.completed;
			});
		}
	};

	exports.app = new Vue({

		// the root element that will be compiled
		el: '.todoapp',

		// app initial state
		data: {
			todos: todoStorage.fetch(),
			newTodo: '',
			editedTodo: null,
			visibility: 'all',
			today: ''
		},

		// watch todos change for localStorage persistence
		watch: {
			todos: {
				deep: true,
				handler: todoStorage.save
			}
		},

		// computed properties
		// http://vuejs.org/guide/computed.html
		computed: {
			filteredTodos: function () {
				return filters[this.visibility](this.todos);
			},
			remaining: function () {
				return filters.active(this.todos).length;
			},
			allDone: {
				get: function () {
					return this.remaining === 0;
				},
				set: function (value) {
					this.todos.forEach(function (todo) {
						todo.completed = value;
					});
				}
			}
		},

		// methods that implement data logic.
		// note there's no DOM manipulation here at all.
		methods: {

			pluralize: function (count) {
				// return word + (count === 1 ? '' : 's');
				return count !== 0 ? '革命尚未成功' : '赞，全部都完成了';
			},

			addTodo: function () {
				let value = this.newTodo && this.newTodo.trim();
				if (!value) {
					return;
				}
				this.todos.push({
					id: this.todos.length + 1,
					title: value,
					completed: false
				});
				this.newTodo = '';
			},

			removeTodo: function (todo) {
				let _this = this;
				const strCompleted = todo.completed ? '该任务已完成' : '该任务未完成';
				const options = {
					type: 'warning',
					cancelId: 3,
					title: '警告',
					detail: '删除之后是无法还原的哟',
					buttons: ['确定', '取消'],
					message: strCompleted + '，确定移除该项吗？'
				}
				dialog.showMessageBox(options, function (response, checkboxChecked) {
					if (response === 0) {
						let index = _this.todos.indexOf(todo);
						_this.todos.splice(index, 1);
					}

				});
			},

			editTodo: function (todo) {
				this.beforeEditCache = todo.title;
				this.editedTodo = todo;
			},

			doneEdit: function (todo) {
				if (!this.editedTodo) {
					return;
				}
				this.editedTodo = null;
				todo.title = todo.title.trim();
				if (!todo.title) {
					this.removeTodo(todo);
				}
			},

			cancelEdit: function (todo) {
				this.editedTodo = null;
				todo.title = this.beforeEditCache;
			},

			removeCompleted: function () {
				this.todos = filters.active(this.todos);
			},

			getNow: function () {
				let tempDate = new Date();
				this.today = formatDate(tempDate, 2);
				return this.today;
			},
			randomchangeImg:function(){
				const tempRandom = Math.floor(Math.random()*5 + 1);
				const bgDom = document.getElementsByClassName('themeBackground')[0];
				const oldTheme = bgDom.classList[3];
				bgDom.classList.remove(oldTheme);
				bgDom.classList.add('theme0'+tempRandom);
			}
		},

		// a custom directive to wait for the DOM to be updated
		// before focusing on the input field.
		// http://vuejs.org/guide/custom-directive.html
		directives: {
			'todo-focus': function (el, binding) {
				if (binding.value) {
					el.focus();
				}
			}
		}
	});

})(window);