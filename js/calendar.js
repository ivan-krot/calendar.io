var Calendar = React.createClass({
    calc: function (year, month, id) {
        if (document.getElementById(id)) {
            document.getElementById(id).classList.remove('selected');
            this.setState({selectedElementID: null});
        }
        return {
            firstOfMonth: new Date(year, month, 1),
            daysInMonth: new Date(year, month + 1, 0).getDate()
        };
    },
    componentWillMount: function () {
        this.setState(this.calc.call(null, this.state.year, this.state.month));
    },
    getInitialState: function(){
        var date = new Date();
        return {
            year: date.getFullYear(),
            month: date.getMonth(),
            selectedYear: date.getFullYear(),
            selectedMonth: date.getMonth(),
            selectedDate: date.getDate(),
            selectedDt: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
            startDay: 1,//1-RU 0-US
            minDate: this.props.minDate ? this.props.minDate : null,
            disablePast: this.props.disablePast ? this.props.disablePast : false,
            dayNames: ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'],
            dayNamesEn: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
            monthNames: ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"],
            monthNamesEn: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            monthNamesFull: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"],
            monthNamesFullEn: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            firstOfMonth: null,
            daysInMonth: null,
            selectedElementID: null
        }
    },
    getPrev: function () {
        var state = {};
        if (this.state.month > 0) {
            state.month = this.state.month - 1;
            state.year = this.state.year;
        } else {
            state.month = 11;
            state.year = this.state.year - 1;
        }
        Object.assign(state, this.calc.call(null, state.year, state.month, state.selectedElementID));
        this.setState(state);
    },
    getNext: function () {
        var state = {};
        if (this.state.month < 11) {
            state.month = this.state.month + 1;
            state.year = this.state.year;
        } else {
            state.month = 0;
            state.year = this.state.year + 1;
        }
        Object.assign(state, this.calc.call(null, state.year, state.month, state.selectedElementID));
        this.setState(state);
    },
    today: function () {
        if (document.getElementById(this.state.selectedElementID)) {
            document.getElementById(this.state.selectedElementID).classList.remove('selected')
        }
        var state = {};
        state.month = new Date().getMonth();
        state.year = new Date().getFullYear();
        Object.assign(state, this.calc.call(null, state.year, state.month, state.selectedElementID));
        this.setState(state);
    },
    selectDate: function (year, month, date, e, id) {
        if (this.state.selectedElementID === null || document.getElementById(this.state.selectedElementID) === null) {
            document.getElementById(id).classList.add('selected');//first click
        } else if (this.state.selectedElementID != id) {
            document.getElementById(this.state.selectedElementID).classList.remove('selected');//change element
            document.getElementById(id).classList.add('selected');
        } else if (this.state.selectedElementID == id){//click on current
            document.getElementById(id).classList.contains('selected') ? document.getElementById(id).classList.remove('selected') : document.getElementById(id).classList.add('selected');
        } else {
            document.getElementById(id).classList.add('selected');
        }
        this.setState({
            selectedYear: year,
            selectedMonth: month,
            selectedDate: date,
            selectedDt: new Date(year, month, date),
            selectedElementID: id
        });
    },
    render: function(){
        return (
            <div className="container ">
            <Search selectDate={this.state.selectDate}
            monthNames={this.state.monthNames}/>
            <Header monthNamesFull={this.state.monthNamesFull}
            month={this.state.month}
            year={this.state.year}
            onPrev={this.getPrev}
            onNext={this.getNext}
            today={this.today}/>
            <MonthDates firstOfMonth={this.state.firstOfMonth}
            daysInMonth={this.state.daysInMonth}
            year={this.state.year}
            month={this.state.month}
            disablePast={this.state.disablePast}
            minDate={this.state.minDate}
            dayNames={this.state.dayNames}
            selectDate={this.selectDate}
            startDay={this.state.startDay}
            onPrev={this.getPrev}
            onNext={this.getNext}/>
            </div>
            )
    }
})

var Search = React.createClass({
    componentDidMount: function() {
        ReactDOM.findDOMNode(this.refs.request).focus();
    },
    getInitialState: function(){
        var storage = localStorage || [];
        return {
            storage : storage,
            keys : [],
            list: []
        }
    },
    finder: function(){
        var str = ReactDOM.findDOMNode(this.refs.request).value;
        var keys_arr = [];
        var i=0;
        var result = [];
        for (i=0; i<this.state.storage.length; i++){
            keys_arr.push(this.state.storage.key(i))
        }
        this.setState({ keys : keys_arr });

        for(var j=0;j<keys_arr.length;j++){
            var key_day = JSON.parse(localStorage.getItem(keys_arr[j]));
            key_day.map(function(event,i){
             for(var i=0;i<event.length;i++){
                if (~event[i].toLowerCase().indexOf(str.toLowerCase())) {
                    var once = []
                    once.push(event[0])
                    once.push(keys_arr[j])
                    result.push(once)
                    break;
                }
            }
        })
        }
        if (str) {
            this.setState({list:result})
        } else {
            this.setState({list:undefined})
        }
    },
    clear: function(){
        ReactDOM.findDOMNode(this.refs.request).value = '';
        this.finder();
    },
    render: function(){
        var that = this;
        return (
            <div className="search clearfix ">
            <div className="pull-right col-sm-3 ">
            <form>
            <input placeholder="Событие, дата или участник"
            type="text" ref="request" onChange={this.finder} id="search_input" onBlur={this.clear}/>
            <input type="reset" className="btn-clear " onClick={this.clear} value="&#8634;"/>
            </form>
            <ul className="output col-sm-11 pull-right">
            {
                this.state.list ?
                this.state.list.map(function(item,i){
                        // console.log(this.state.list);
                        var date = item[1].split('-');//year-month-date => 0-1-2
                        return (<ul key={(item+date+i).toString()}>
                            <li>{item[0]}</li>
                            <li>{date[2]+' '+that.props.monthNames[date[1]]+' '+date[0]}</li>
                            </ul>
                            )
                    }) : ''
            }
            </ul>
            </div>
            </div>
            )
    }
})

var Header = React.createClass({
    render: function(){
        return (
            <div className="row-head ">
            <button className="btn btn-xs btn-default " onClick={() => {this.props.onPrev()}}>&#9668;</button>
            <span className="row-title "> {this.props.monthNamesFull[this.props.month]} {this.props.year} </span>
            <button className="btn btn-xs btn-default " onClick={() => {this.props.onNext()}}>&#9658;</button>
            <button className="btn btn-today btn-default btn-xs " onClick={() => {this.props.today()}}>Сегодня</button>
            </div>
            )
    }
})

var MonthDates = React.createClass({
    statics: {
        year: new Date().getFullYear(),
        month: new Date().getMonth(),
        date: new Date().getDate(),
        today: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())
    },
    clearLS: function(){
        localStorage.clear();
    },
    render: function(){
        var setStartDay = this.props.startDay,
        startDay = this.props.firstOfMonth.getUTCDay(),
        first = this.props.firstOfMonth.getDay(),
        rows = 5,
        that = this;
        if (startDay == 5 && this.props.daysInMonth == 31 || startDay == 6 && this.props.daysInMonth > 29) {
            rows = 6;
        }
        var haystack = Array.apply(null, { length: rows }).map(Number.call, Number);
        var weekStack = Array.apply(null, { length: 7 }).map(Number.call, Number);
        var day = first;
        day = setStartDay + 1 - first;
        while (day > 1) {
            day -= 7;
        }
        day -= 1;
        var haystack = haystack.map(function(item,i){
            var d = day + i * 7;
            var weekDaysIndicator = i==0 ? true:false;
            var weekDayCounter = 0;
            var disabledCounter = 0;
            var prevMonth = new Date(that.props.year, that.props.month, 0).getDate();
            var prevCounter = Math.abs(day)-1;
            return (
                <div    key={item}
                className='week-row '>
                {weekStack.map(function (item, i) {
                    d += 1;
                    var current = new Date(that.props.year, that.props.month, d);
                    var nameOfClass = current.getTime() === that.constructor.today.getTime() ? 'today form-container ' : 'form-container ';
                    if (d<=0){
                        return(<div key={item} 
                            className="single-day disabled ">
                            <div    className={nameOfClass}
                            onClick={() => {that.props.onPrev()}}>
                            {that.props.dayNames[weekDayCounter++]+", "+(prevMonth-prevCounter--)}
                            </div>
                            </div>)
                    } if(d > 0 && d <= that.props.daysInMonth) {
                        disabledCounter = 0;
                        var idKey = that.props.year+"-"+that.props.month+"-"+d;
                        return(<div key={item} 
                            className="single-day ">
                            <div    className={nameOfClass}
                            key={idKey} 
                            id={idKey}
                            onClick={(e) => {that.props.selectDate(that.props.year, that.props.month, d, e, idKey)}}>
                            { weekDaysIndicator ? that.props.dayNames[weekDayCounter++]+", "+d :d }
                            {localStorage.getItem(idKey) !== null ? ' ' : ''}
                            <span className="hide-form pull-right" >&times;</span>
                            <TodoList   key={idKey+item}
                            idKey={idKey} 
                            form_position={i}/>
                            </div>
                            </div>)
                    } else if (d > that.props.daysInMonth) {
                        return(<div key={item} 
                            className="single-day disabled ">
                            <div    className={nameOfClass} 
                            onClick={() => {that.props.onNext()}}>
                            {++disabledCounter}
                            </div>
                            </div>)
                    }
                }
                )}
                </div>
                )
        })
        return (
            <div className={rows === 6 ? 'all-month calendar-width ' : 'all-month calendar-width fix '}>
            {haystack}
            <button className='btn-xs btn-danger' onClick={this.clearLS}>Очистить все данные</button>
            </div>
            )
    }
})

var TodoItem = React.createClass({
    getInitialState: function(){
        return {
            remove: 'Удалить',
        }
    },
    done: function() {
        this.props.done(this.props.todo);
    },
    edit: function() {
        this.props.edit(this.props.todo);
    },
    render: function() {
        var arr = this.props.todo
        return <ul onClick={this.edit}>
        {arr.map(function(element,i){
            if(i == 0){
                i = 'Событие: ';
            } else if (i==1) {
                i = 'Участники: ';
            } else {
                i = 'О событии: ';
            }
            return <li key={element+i}><span className="title">{i}</span>{element}</li>
        })}
        <li className="edit_task clearfix " onClick={(e) => e.stopPropagation()}><span className="pull-right" onClick={this.done}>&times;{this.state.remove}</span></li>
        </ul>
    }
});

var TodoList = React.createClass({
    getInitialState: function() {
        var key = this.props.idKey;
        var dataBase = JSON.parse(localStorage.getItem(key)) || [];
        return {
            todos: dataBase,
            key: this.props.idKey,
            index_edit: undefined,
            edit_button: 'Изменить',
            add_button: 'Добавить',
            event: 'Событие',
            desc: 'Описание...',
            clear: 'Сбросить',
            editEvent: 'Редактор события',
            createEvent: 'Создание события',
            participant: 'Имена участников'
        };
    },
    new: function(){
        this.setState({index_edit: undefined});
        ReactDOM.findDOMNode(this.refs.event).value = "";
        ReactDOM.findDOMNode(this.refs.participant).value = "";
        ReactDOM.findDOMNode(this.refs.description).value = "";
        ReactDOM.findDOMNode(this.refs.save).innerHTML = this.state.add_button;
    },
    add: function() {
        function getValue(ref){ return ReactDOM.findDOMNode(ref).value;}
        var todos = this.state.todos;
        var key = this.state.key;

        var arr = [
        getValue(this.refs.event),
        getValue(this.refs.participant),
        getValue(this.refs.description)
        ];
        if (this.state.index_edit !== undefined) {
            todos.splice(this.state.index_edit, 1, arr);
            this.setState({index_edit: undefined});
        } else {
            todos.push(arr);
        }
        ReactDOM.findDOMNode(this.refs.event).value = "";
        ReactDOM.findDOMNode(this.refs.participant).value = "";
        ReactDOM.findDOMNode(this.refs.description).value = "";
        localStorage.setItem(key, JSON.stringify(todos));
        this.setState({ todos: todos });
    },
    reset: function (){
        ReactDOM.findDOMNode(this.refs.event).value = "";
        ReactDOM.findDOMNode(this.refs.participant).value = "";
        ReactDOM.findDOMNode(this.refs.description).value = "";
    },
    edit: function (todo){
        var key = this.state.key;
        var todos = this.state.todos;
        var elem_position = todos.indexOf(todo);
        this.setState({index_edit: elem_position});
        var event, participant, description;
        todo.map(function (element, i){
            if(i == 0){
                event = element;
            } else if (i==1) {
                participant = element;
            } else {
                description = element;
            }
        })
        ReactDOM.findDOMNode(this.refs.event).value = event;
        ReactDOM.findDOMNode(this.refs.participant).value = participant;
        ReactDOM.findDOMNode(this.refs.description).value = description;
        ReactDOM.findDOMNode(this.refs.save).innerHTML = this.state.edit_button;
    },
    done: function(todo) {
        var key = this.state.key;
        var todos = this.state.todos;
        todos.splice(todos.indexOf(todo), 1);
        todos.length == 0 ? localStorage.removeItem(key) : localStorage.setItem(key, JSON.stringify(todos));
        this.setState({ todos: todos });
    },
    render: function() {
        var key = this.state.key;
        return (
          <div>
          <div className="tasks-output">
          {
            this.state.todos.map(function(todo,i) {
                return <TodoItem    key={i+todo.toString()} 
                todo={todo} 
                done={this.done} 
                edit={this.edit} />
                alert(i+todo.toString());
            }.bind(this))
        }
        </div>
        <div className={this.props.form_position > 3 ? "form left ":"form "} onClick={(e) => e.stopPropagation()}>
        <button className="pull-left btn-success btn-xs" onClick={this.new}>Новое</button>
        <span className="informer">{this.state.index_edit !== undefined ? this.state.editEvent : this.state.createEvent }</span>
        <input type="text" ref="event" placeholder={this.state.event}/>
        <input type="text" ref="participant" placeholder={this.state.participant}/>
        <textarea ref="description" placeholder={this.state.desc} />
        <button className="btn-default" onClick={this.add} ref="save" >{this.state.add_button}</button>
        <input type="reset" className="btn-default" onClick={this.reset} value={this.state.clear} />
        </div>
        </div>
        );
    }
});

ReactDOM.render(
    <Calendar />,
    document.getElementById("calendar")
    );