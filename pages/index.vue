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

  onMounted (() => {
    getData()
  })
</script>
<template>
  <div>
    <DataTable :value="tableData" class="min-width: 50rem">
        <Column field="number" header="Code"/>
    </DataTable>
  </div>
</template>