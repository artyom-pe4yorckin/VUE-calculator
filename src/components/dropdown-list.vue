<template>
  <div class="dropdown-list">
    <p class="dropdown-list-title" v-on:click="showList">{{ title }} <span v-html="icon"></span></p>
    <div class="dropdown-list-content">
      <slot></slot>
    </div>
  </div>
</template>
<script>

export default {
  props: ['title'],//обязательно массив
  data() {
    return {
      icon: ''
    };
  },
  name: "App",
  components: {},
  methods: {
    showList(e) {
      let title = e.currentTarget;
      let dropdownList = title.closest(".dropdown-list")
      let dropdownListContent = dropdownList.querySelector(".dropdown-list-content")
      if (dropdownList.classList.contains("open")) {
        //закрыть
        dropdownListContent.setAttribute("style", "")
        dropdownList.classList.remove("open")
      } else {
        //открыть
        let maxHeight = 0;
        let content = dropdownList.querySelectorAll(".dropdown-list-content>*")
        for (let elem of content) {
          maxHeight += elem.offsetHeight + parseInt(getComputedStyle(elem, true).marginTop) + parseInt(getComputedStyle(elem, true).marginBottom);
        }
        dropdownListContent.style.maxHeight = maxHeight + "px";
        dropdownList.classList.add("open")
      }
    }
  },
  //Выполняется когда всё смонтировано
  mounted: function() {
    let path = require('@/assets/img/arrow-down.svg')
    fetch(path).then(response=>{
      return response.text()
    }).then(data=>{
      this.icon = data
    })
  }
};
</script>
<style>
.dropdown-list {
  display: flex;
  flex-direction: column;
  gap: 0;
  transition: .3s;
}

.dropdown-list-title {
  margin: 0;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  transition: .3s;
  color: var(--green);
}
.open .dropdown-list-title{
  color: var(--black);
}

.dropdown-list-title svg {
  transform: rotate(-90deg);
  transition: .3s;
  width: 1rem;
}

.dropdown-list-title path {
  stroke: var(--green);
}

.dropdown-list.open svg {
  transform: rotate(0deg);
}

.dropdown-list-content {
  max-height: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: .3s;
  box-sizing: content-box;
}
.open .dropdown-list-content{
  padding-bottom: 10px;
}

.dropdown-list.open .dropdown-list-content{

}
</style>