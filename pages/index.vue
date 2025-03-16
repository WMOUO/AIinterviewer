<script setup>
  const supabase = useSupabaseClient();
  
  const tableData = ref([])
  const getData = async() => {
    const {data,error} = await supabase.from('test').select("*")
    if (error) {
      console.log(error.message)
    }
    tableData.value = data
    console.log(data)
  }
  const tableColumn = ref([{ title: "number", key: "number"}])

  onMounted (() => {
    getData()
  })
</script>
<template>
  <div>
    Index
    <n-data-table :data="tableData" :columns="tableColumn"/>
  </div>
</template>