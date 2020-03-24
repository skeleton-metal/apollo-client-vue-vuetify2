<template>
    <v-card class="elevation-6">

        <v-card-title>
            <v-row>
                <v-col class="text-xs-center"><h2>{{title}}</h2></v-col>
            </v-row>
        </v-card-title>

        <v-card-text>
           
           <v-col md6 xs12 class="offset-md6">
            <v-text-field v-model="filter.search" v-on:keyup.native.enter="updatePage" append-icon="search" label="Buscar" hide-details />
           </v-col>

           <v-data-table dense class="mt-3" :headers="headers" :items="items"
                          :search="filter.search" :single-expand="false" :loading="loading"
                         :server-items-length="totalItems" :items-per-page="limit" :page.sync="pageNumber" @update:page="updatePage"
                          >

              <div slot="no-data" color="info" outline class="text-xs-center">Sin datos</div>
               
              <div slot="loading" outline color="info">Cargando</div>

              <template v-slot:item.action="{ item }">
                  <v-icon color="info" small class="mr-2" @click="openShow(item)">search</v-icon>
                  <v-icon color="primary" small class="mr-2" @click="openEdit(item)">edit</v-icon>
                  <v-icon color="red" small class="mr-2" @click="openDelete(item)">delete</v-icon>
              </template>

            </v-data-table>
        </v-card-text>


        <v-dialog :value="showing" width="850" fullscreen persistent>
            <group-show :item="itemToShow" v-if="showing"  v-on:closeDialog="showing=false" />
        </v-dialog>
        
        <v-dialog :value="deleting" width="850" fullscreen persistent>
            <group-delete :item="itemToDelete" v-if="deleting" v-on:itemDelete="updatePage" v-on:closeDialog="deleting=false" />
        </v-dialog>

        <v-dialog :value="creating" width="850" fullscreen persistent>
            <group-create v-if="creating" v-on:itemCreate="itemCreate" v-on:closeDialog="creating=false" />
        </v-dialog>
        
         <v-dialog :value="updating" width="850" persistent>
            <group-update v-if="updating" :item="itemToEdit" v-on:itemUpdate="itemUpdate" v-on:closeDialog="updating=false" />
        </v-dialog>


        <v-btn class="elevation-8" color="#D81B60" fab fixed bottom right dark @click="creating = true">
            <v-icon>add</v-icon>
        </v-btn>

    </v-card>
</template>

<script>
    import GroupProvider from '../providers/GroupProvider'
    
    import GroupCreate from "./GroupCreate";
    import GroupUpdate from "./GroupUpdate";
    import GroupDelete from "./GroupDelete";
    import GroupShow from "./GroupShow";
    
    export default {
        name: "GroupDataTable",
        components: {GroupCreate, GroupUpdate, GroupDelete, GroupShow},
        created() {
            this.updatePage()
        },
        methods: {
            itemCreate(item) {
                this.items.push(item)
            },
            itemUpdate(item) {
                let index = this.items.findIndex(i => i.id == item.id)
                this.$set(this.items, index, item)
            },
            openEdit(item) {
                this.updating = true
                this.itemToEdit = item
            },
            openShow(item) {
                this.showing = true
                this.itemToShow = item
            },
            openDelete(item) {
                this.deleting = true
                this.itemToDelete = item
            },
            update() {
                this.loading = true
                GroupProvider.groups().then(r => {
                    this.items = r.data.groups
                    this.loading = false
                })
            },
            updatePage() {
                this.loading = true
                GroupProvider.paginateGroups(this.limit, this.pageNumber, this.filter.search).then(r => {
                    this.items = r.data.groupsPaginate.items
                    this.totalItems = r.data.groupsPaginate.totalItems
                    this.loading = false
                })
            }
        },
        data() {
            return {
                title: 'Listado de Group',
                creating: false,
                updating: false,
                deleting: false,
                showing: false,
                loading: false,
                expanded: [],
                itemToEdit: null,
                itemToDelete: null,
                itemToShow: null,
                filter: {
                    search: '',
                },
                items: [],
                headers: [
                    {text: 'Name', value: 'name'},
                    {text: 'Aciones', value: 'action', sortable: false},
                ],
                totalItems: 0,
                limit: 5,
                pageNumber: 1
            }
        }
    }
</script>

