export default {
    namespaced:true,
    state:{
        isCollapse: false,
    },
    mutations:{
        collapseMenu(state){
            state.isCollapse = !state.isCollapse;
        }   
    }
}