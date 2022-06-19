<template>
  <div class="calculator">
    <div class="input">
      <div class="equation-inputs">
        <div class="expression">
          <textarea spellcheck="false"
                    rows="1"
                    class="expression_txt"
                    v-bind:class="{extraPadding:lastStrIsEmpty}"
                    v-on:keypress="validator($event)"
                    v-on:keydown.tab="tab"
                    v-on:click="updateCarriagePos()"
                    v-model="expression"></textarea>
          <!--extraPadding нужен т.к. первая строка выходит за вьюбокс текстареа, -->
          <pre class="expression_highlighting"
               v-bind:class="{extraPadding:lastStrIsEmpty}"
               v-html="highlightingHTML"></pre>
        </div>
        <dropdownList title="Конструктор" class="constructor">
          <div class="constructor_head tab-block">
            <div class="tab_title-list">
              <div v-on:click="openTab" class="constructor_tab-title" data-tab="arithmetic" v-html="icons['plus-minus']"></div>
              <div v-on:click="openTab" class="constructor_tab-title" data-tab="trigonometry" v-html="icons.trigonometry"></div>
              <div v-on:click="openTab" class="constructor_tab-title" data-tab="constants" v-html="icons.pi"></div>
            </div>
            <div class="tab_list">
              <div class="constructor_tab" data-tab="arithmetic">
                <div class="operation" v-html="icons.plus"></div>
                <div class="operation" v-html="icons.minus"></div>
                <div class="operation" v-html="icons.multiply"></div>
                <div class="operation" v-html="icons.division"></div>
                <div class="operation" v-html="icons.exponentiation"></div>
              </div>
              <div class="constructor_tab" data-tab="trigonometry">
                <div class="operation">sin</div>
                <div class="operation">cos</div>
                <div class="operation">tg</div>
                <div class="operation">ctg</div>
              </div>
              <div class="constructor_tab" data-tab="constants">
                <div class="operation">π</div>
                <div class="operation">e</div>
              </div>
            </div>
          </div>
          <div class="constructor_body"></div>
        </dropdownList>
      </div>
      <div class="buttons">
        <div class="numbers">
          <button class="number-btn" data-value="1" v-on:click="changeExpression">1</button>
          <button class="number-btn" data-value="2" v-on:click="changeExpression">2</button>
          <button class="number-btn" data-value="3" v-on:click="changeExpression">3</button>
          <button class="number-btn" data-value="4" v-on:click="changeExpression">4</button>
          <button class="number-btn" data-value="5" v-on:click="changeExpression">5</button>
          <button class="number-btn" data-value="6" v-on:click="changeExpression">6</button>
          <button class="number-btn" data-value="7" v-on:click="changeExpression">7</button>
          <button class="number-btn" data-value="8" v-on:click="changeExpression">8</button>
          <button class="number-btn" data-value="9" v-on:click="changeExpression">9</button>
          <button class="number-btn" data-value="0" v-on:click="changeExpression">0</button>
          <button class="operator-btn" data-value="." v-on:click="changeExpression">.</button>
          <button class="operator-btn" data-value="()" v-on:click="wrapInBrackets">(...)</button>
          <button class="operator-btn" data-value="backspace" v-on:click="changeExpression" v-html="icons.backspace"></button>
        </div>
        <div class="operators">
          <dropdownList title="Арифметика">
            <div class="operator-group-wrapper">
              <div class="operator-group">
                <button class="operator-btn" v-on:click="changeExpression" data-value="+" v-html="icons.plus"></button>
                <button class="operator-btn" v-on:click="changeExpression" data-value="-" v-html="icons.minus"></button>
                <button class="operator-btn" v-on:click="changeExpression" data-value="*" v-html="icons.multiply"></button>
                <button class="operator-btn" v-on:click="changeExpression" data-value="/" v-html="icons.division"></button>
                <button class="operator-btn" v-on:click="changeExpression" data-value="^" v-html="icons.exponentiation"></button>
                <button class="operator-btn" v-on:click="changeExpression" data-value="root(,)" v-html="icons.root"></button>
                <button class="operator-btn" v-on:click="changeExpression" data-value="!">!</button>
              </div>
            </div>
          </dropdownList>
          <dropdownList title="Тригонометрия">
            <div class="operator-group-wrapper">
              <div class="operator-group">
                <button class="operator-btn" v-on:click="changeExpression" data-value="sin()">sin</button>
                <button class="operator-btn" v-on:click="changeExpression" data-value="cos()">cos</button>
                <button class="operator-btn" v-on:click="changeExpression" data-value="tg()">tg</button>
                <button class="operator-btn" v-on:click="changeExpression" data-value="ctg()">ctg</button>
              </div>
            </div>
          </dropdownList>
          <dropdownList title="Константы">
            <div class="operator-group-wrapper">
              <div class="operator-group">
                <button class="operator-btn" v-on:click="changeExpression" data-value="pi">π</button>
                <button class="operator-btn" v-on:click="changeExpression" data-value="e">e</button>
              </div>
            </div>
          </dropdownList>
        </div>
      </div>
    </div>

    <div class="output">
      <button class="calculate" v-html="icons.equals" v-bind:disabled="expressionIsCorrect ? false : ''"></button>
      <p class="answer">{{ answer }}</p>
      <ol class="error-list" v-show="!expressionIsCorrect">
        <li class="error-item" v-for="msg of errorArr">
          <div class="error-txt" v-html="msg"></div>
        </li>
      </ol>
    </div>
  </div>
</template>

<script>
import dropdownList from '@/components/dropdown-list'

export default {
  data() {
    return {
      icons: {
        plus: '',
        minus: '',
        multiply: '',
        division: '',
        exponentiation: '',
        equals: '',
        backspace: '',
        root: '',
        'plus-minus': '',
        trigonometry: '',
        pi: ''
      },
      expression: '',
      answer: 0,
      expressionInput: '',
      highlightingHTML: '',
      carriagePos: 0,
      lastStrIsEmpty: false,
      operators: ['+', '-', '*', '/', '^', '!'],
      baseOperators: ['+', '-'],
      derivedOperators: ['*', '/', '^', '!'],
      constants: ["pi", "e"],
      trigonometry: ['sin', 'cos', 'tg', 'ctg'],
      trigonometryAndConstants: [],
      expressionIsCorrect: true,
      errorArr: [],
      errorMsg: {
        'openBracket' : {
          'prev': `<p>Перед '(' может быть только оператор или '('</p>`,
          'next': `<p>После '(' может быть только любая скобка, число или '-'</p>`,
          'root': `<p>В root должны передаваться числа (сперва подкоренное выражение, затем степень корня)</p>`,
        },
        'brackets': 'В выражении содержатся незакрытые скобки',
        'closeBracket' : {
          'prev': `<p>Перед ')' может быть только число, константа или любая скобка</p>`,
          'next': `<p>После ')' может быть только оператор или ')'</p>`
        },
        'operator' : {
          'prev': `<p>Перед оператором (кроме '-') может быть только число или '!'</p>`,
          'next': `<p>После оператора (кроме '!') может быть только число или '-', а после '!' только оператор (кроме !), ',' или ')'</p>`,
          'middle': `<p>2 и более оператора не могут идти подряд (кроме случая когда их 2 и 1й не '-' или '!')</p>`
        },
        'exponentiation':{
          'prev': 'возводить в степень можно только числа, константы и содержимое скобок',
          'next': 'степень должна быть обернута в скобки или начинаться с \'-\' или числа'
        },
        'num' : {
          'prev': `<p>Перед числом может идти только другое число, оператор (кроме !) или '('</p>`,
          'next': `<p>После числа может идти только другое число, оператор или ')'</p>`
        },
        'root' : {
          'rootDoesntExist' : `<p>',' Может находиться только в операторе root</p>`,
          'wrongRootContent' : `<p>В операторе root должны быть 2 выражения или числа, разделённые ','</p>`
        },
        'separator': {
          'tooMany': '2 и более разделителя не могут идти подряд',
          'dot': `Десятичный разделитель должен находиться между 2 цифрами`,
          'number': 'В числе может быть только 1 десятичный разделитель'
        },
        'edges': {
          'start': `Выражение не может начинаться с операторов (кроме '-') и ')'`,
          'end': `Выражение не может заканчиваться на оператор (кроме '!') и '('`
        },
        'words': `<p>В выражении есть неподдерживаемые функции или константы: _placeholder_</p>`
      },
    };
  },
  name: "App",
  components: {
    dropdownList
  },
  methods: {
    //проверка символа на допустимость (латиница, цифры, скобки, !, точка, табы и переносы строк)
    validator(e){
      let char = String.fromCharCode(e.keyCode);
      if(/[^^\/*+\-\da-zA-Z()!\.,]/.test(char) && e.keyCode!=13 && e.keyCode!=32){
        e.preventDefault()
      }else{
        //если нажат enter то последняя строка пустая
        this.lastStrIsEmpty = e.keyCode==13
      }
    },

    //переключение между табами в конструкторе
    openTab(e) {
      let elem = e.currentTarget
      let tabId = elem.getAttribute('data-tab')
      if(tabId){
        let tab = elem.closest('.tab-block')
        if(tab){
          let prevTab = tab.querySelector('.tab_list [data-tab].active')
          let prevTabTitle = tab.querySelector('.tab_title-list [data-tab].active')
          if(prevTab) prevTab.classList.remove('active')
          if(prevTabTitle) prevTabTitle.classList.remove('active')
          elem.classList.add('active')
          tab.querySelector(`.tab_list [data-tab="${tabId}"]`).classList.add('active')
        }
      }
    },

    //вставка отступа при нажатии на tab
    tab(e){
      // get caret position/selection
      let start = this.expressionInput.selectionStart;
      let end = this.expressionInput.selectionEnd;

      // set textarea value to: text before caret + tab + text after caret
      this.expression = this.expression.substring(0, start) + "\t" + this.expression.substring(end);

      // put caret at right position again (add one for the tab)
      this.expressionInput.selectionStart = this.expressionInput.selectionEnd = start + 1;

      // prevent the focus lose
      e.preventDefault();
    },

    //Ввод по кнопкам
    changeExpression(e) {
      let currentThing = e.currentTarget.getAttribute("data-value")
      if(currentThing=="backspace"){
        this.lastStrIsEmpty = false
        this.expression = this.expression.substring(0, this.carriagePos-1) + this.expression.substring(this.carriagePos, this.expression.length)
        this.carriagePos--
      }else{
        this.expression = this.expression.substring(0, this.carriagePos) + currentThing + this.expression.substring(this.carriagePos, this.expression.length)
        this.carriagePos = this.carriagePos + currentThing.length
      }
    },

    updateCarriagePos(){
      this.carriagePos = this.expressionInput.selectionEnd
    },

    //Оборачивание в скобки по кнопке
    wrapInBrackets() {
      let txt = this.expression.split('')
      txt.splice(this.expressionInput.selectionStart, 0, "(")
      txt.splice(this.expressionInput.selectionEnd+1, 0, ")")
      this.expression = txt.join('')
    },

    //подсветка ошибок
    doHighlighting(){
      let expression = this.expression;
      let html = [];
      for(let i=0; i<expression.length; i++){
        let char = expression[i];
        let cssClass = ''
        if(char=="(" || char==")" ) cssClass = 'bracket'
        else if(this.operators.includes(char)) cssClass = 'operator'
        else if(/\d/.test(char)) {
          let remainingStr = expression.substring(i)
          let num = remainingStr.match(/\d+/)
          i += num[0].length-1
          char = num[0]
          cssClass = 'number'
        }
        //пробельные символы, вкючая переносы строк
        else if(/\n/.test(char)) cssClass = 'lineBreak'
        else if(/\t/.test(char)) cssClass = 'tab'
        else if(/\s/.test(char)) cssClass = 'whitespace'
        else if(/[.,]/.test(char)) cssClass = 'dot'
        //проверяем на константы и тригонометрию
        else if(/[a-zA-Z]/.test(char)){
          //получаем всю оставщуюся строку и ищем в ней константы или тригонометрию
          let remainingStr = expression.substring(i)
          let somethigFoud = false;
          for(let str of this.trigonometryAndConstants){
            if(remainingStr.indexOf(str)===0){
              cssClass = this.isTrigonometry(str) ? 'trigonometry' : 'constant';
              i += str.length-1;
              somethigFoud = true;
              char = str
              break;
            }
          }
          if(remainingStr.indexOf('root')===0){
            cssClass = 'operator'
            i += 3;
            somethigFoud = true;
            char = 'root'
          }
          if(!somethigFoud) cssClass = 'wrong'
        }else{
          cssClass = 'wrong'
        }
        html.push(`<span class="${cssClass}">${char}</span>`)
      }
      this.highlightingHTML = html.join('')
    },

    isOperator(char) {
      return this.operators.includes(char)
    },

    //проверяет заканчивается ли строка на тригонометрическую подстроку
    isTrigonometry(str){
      if(!str || str.length==0) return false
      for(let t of this.trigonometry){
        let reg = new RegExp(`${t}$`);
        if(str.match(reg)){
          return true
        }
      }
      return false
    },

    isRoot(str){
      if(!str || str.length==0) return false
      if(str.match(/root$/)){
        return true
      }
      return false
    },

    isConstant(str, direction){
      if(!str || str.length==0) return false
      for(let c of this.constants){
        let reg
        if(direction=='prev'){
          reg = new RegExp(`${c}$`);
        }else if(direction=='next'){
          reg = new RegExp(`^${c}`);
        }
        if(str.match(reg)){
          return true
        }
      }
      return false
    },

    validatePartialExp(str) {
      str = str.replace(/\s/g, '')
      let result = {valid: true, errorArr: []}
      if(str.length===0) return result

      function updateErrorArr(msg){
        result.valid = false
        if(!result.errorArr.includes(msg)) result.errorArr.push(msg)
      }

      if ((this.isOperator(str[0]) && str[0]!='-') || str[0] == ")") {
        updateErrorArr(this.errorMsg.edges.start)
      }
      //проверка синтаксиса корня
      if(!/root/.test(str) && /,/.test(str)){
        updateErrorArr(this.errorMsg.root.rootDoesntExist)
      }else if(/root/.test(str) && !/root\(.+? ?, ?.+?\)/.test(str)){
        updateErrorArr(this.errorMsg.root.wrongRootContent)
      }
      //в регулярках ищется только то чего быть не должно
      //Проверка операторов
      if(
          /[^\w!\)][*\/^+!]/.test(str) ||
          /\.-/.test(str)
      ){
        updateErrorArr(this.errorMsg.operator.prev)
      }
      if(
          /[-+*\/^][^\w\-\(\)]/.test(str) ||
          /![.\d\(!]/.test(str) ||
          /![\(\.\d]/.test(str)
      ){
        updateErrorArr(this.errorMsg.operator.next)
      }
      if(
          /--/.test(str) ||
          /[*\/^+-][*\/^+!]/.test(str)
      ){
        updateErrorArr(this.errorMsg.operator.middle)
      }
      //синтаксис возведения в степень
      if(
          /[^\dA-Za-z\)]\^/.test(str)
      ){
        updateErrorArr(this.errorMsg.exponentiation.prev)
      }
      if(
          /\^[^-\d\(A-Za-z]/.test(str)
      ){
        updateErrorArr(this.errorMsg.exponentiation.next)
      }
      //Проверка чисел
      if(/\)\d/.test(str)){
        updateErrorArr(this.errorMsg.num.prev)
      }
      if( /\d\(/.test(str) ){
        updateErrorArr(this.errorMsg.num.next)
      }
      //Разделители
      if(/\.\.+/.test(str) || /,,+/.test(str)){
        updateErrorArr(this.errorMsg.separator.tooMany)
      }else if( /([^\d]\.|\.[^\d])/.test(str) ||
          /(^\.|\.$)/.test(str)
      ){
        updateErrorArr(this.errorMsg.separator.dot)
      }
      if( /\d+\.\d+\./.test(str) ){
        updateErrorArr(this.errorMsg.separator.number)
      }
      //закрыты ли скобки
      if(!this.bracketsValidator(str)){
        updateErrorArr(this.errorMsg.brackets)
      }
      //прочие ошибки с (
      if(/[\d!\)]\(/.test(str)){
        updateErrorArr(this.errorMsg.openBracket.prev)
      }
      if(/\([+*\/!^\)]/.test(str)){
        updateErrorArr(this.errorMsg.openBracket.next)
      }
      //прочие ошибки с )
      if(/[^\d!ie\)]\)/.test(str)){
        updateErrorArr(this.errorMsg.closeBracket.prev)
      }
      if(/\)[\d\(]/.test(str)){
        updateErrorArr(this.errorMsg.closeBracket.next)
      }
      //Концы
      if(/^[\)+*\/!^]/.test(str)){
        updateErrorArr(this.errorMsg.edges.start)
      }
      if(/[-+*\/^\(]$/.test(str)){
        updateErrorArr(this.errorMsg.edges.end)
      }
      //буквы
      let words = str.match(/[a-zA-Z]+/g)
      let unexpectedWords = []
      if(words){
        for(let w of words){
          if(!this.trigonometry.includes(w) && !this.constants.includes(w) && w!='root'){
            unexpectedWords.push(w)
          }
        }
      }
      if(unexpectedWords.length>0){
        unexpectedWords = unexpectedWords.map(v=>`<li>${v}</li>`).join('')
        let msg = this.errorMsg.words.replace('_placeholder_', `<ul>${unexpectedWords}</ul>`)
        updateErrorArr(msg)
      }
      let length = str.length
      if (length < 3) {
        if (!this.isConstant(str[0]) && !this.isTrigonometry(str[0]) && !/[\d\(-]/.test(str[0])) {
          updateErrorArr(this.errorMsg.edges.start)
        }
        if(/[+\-*\/^]{2,}/.test(str)){
          updateErrorArr(this.errorMsg.operator.middle)
        }
        this.expressionIsCorrect = result.valid
      }
      return result
    },

    bracketsValidator(str){
      str = str.replace(/[^()]/g, '')
      str = str.split('')
      if(str[0]==")" || str[str.length-1]=='('){
        return false
      }
      if(str.length===0) return true
      let validateArr = []
      //после каждой ( должна идти )
      /*
      * Если ( то добавляем её в массив как незакрытую
      * Если ) то ищем ближайшую (
      *   Если ( не найдена то добавляем ) со статусом незакрытой
      *   Иначе добавляем ) со статусом закрытой и меняем у найденой ) статус на закрытую
      * */
      /* [['(', true], [...]] */
      for(let b=0; b<str.length; b++){
        let bracket = str[b]
        if(bracket=="("){
          validateArr.push([bracket, false])
        }
        if(bracket==")"){
          //если последняя ( уже закрыта то ищем ( раньше
          if(str[b-1]=='('){
            validateArr.push([bracket, true])
            validateArr[b-1][1] = true
          }else{
            for(let i=validateArr.length-1; i>=0; i--){
              if(validateArr[i][0]=='(' && !validateArr[i][1]){
                validateArr.push([bracket, true])
                validateArr[i][1] = true
                break;
              }
              //Если не нашли одинокой ( то добавляем ) как не закрытую
              if(i==0 && (validateArr[i][0]!='(' || validateArr[i][1])){
                validateArr.push([bracket, false])
              }
            }
          }
        }
      }
      if(validateArr.flat().includes(false)){
        return false
      }
      return true
    },
  },
  //Работает только с простыми занчениями типа строк, чтобы отслеживать массивы/объекты надо указать в них конкретный индекс
  watch: {
    expression(newVal, oldVal, e){
      let validator = this.validatePartialExp(newVal)
      this.expressionIsCorrect = validator.valid
      //выводим список ошибок
      if (!validator.valid){
        this.errorArr = validator.errorArr
      }
      this.doHighlighting()
    }
  },
  //Выполняется когда всё смонтировано
  mounted: function() {
    this.expressionInput = document.querySelector('.expression_txt')
    this.trigonometryAndConstants = [...this.constants, ...this.trigonometry]
    //получаем код svg иконок
    for (let i in this.icons) {
      try{
        let path = require(`@/assets/img/${i}.svg`)
        fetch(path).then(response=>{
          return response.text()
        }).then(data=>{
          this.icons[i] = data
        })
      }catch (error){
        console.error(error)
      }
    }

    //активируем первый таб у всех табов
    let tabs = document.querySelectorAll(".tab-block")
    for (let t of tabs) {
      let tabTitle = t.querySelector(".tab_title-list [data-tab]")
      if(tabTitle) tabTitle.click()
    }

    //Открываем первый выпадающий список в операторах
    document.querySelector(".operators>.dropdown-list .dropdown-list-title").click()
  }
};
</script>

<!--Можно сделать отдельный файл стилей и указать в атрибуте src тега ссылку на него-->
<style>
</style>
