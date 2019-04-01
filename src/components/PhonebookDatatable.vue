<template>
  <div>
    <v-toolbar flat color="white">
      <v-toolbar-title>My Contacts</v-toolbar-title>
      <v-divider
        class="mx-2"
        inset
        vertical
      ></v-divider>
      <v-spacer></v-spacer>
      <v-dialog v-model="dialog" max-width="500px">
        <template v-slot:activator="{ on }">
          <v-btn color="primary" dark class="mb-2" v-on="on">New Item</v-btn>
        </template>
        <v-card>
          <v-card-title>
            <span class="headline">{{ formTitle }}</span>
          </v-card-title>

          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 sm6 md4>
                  <v-text-field v-model="editedItem.id" label="Id" disabled></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field v-model="editedItem.fullName" label="Full Name"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field v-model="editedItem.contact" label="Contact"></v-text-field>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click="close">Cancel</v-btn>
            <v-btn color="blue darken-1" flat @click="save">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-toolbar>
    <v-card-title>
      Contacts
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        append-icon="search"
        label="Search"
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="contacts"
      :search="search"
      class="elevation-1"
    >
      <template v-slot:items="props">
        <td>{{ props.item.id }}</td>
        <td class="text-xs-right">{{ props.item.fullName }}</td>
        <td class="text-xs-right">{{ props.item.contact }}</td>
        <td class="justify-center layout px-0">
          <v-icon
            small
            class="mr-2"
            @click="editItem(props.item)"
          >
            edit
          </v-icon>
          <v-icon
            small
            @click="deleteItem(props.item)"
          >
            delete
          </v-icon>
        </td>
      </template>
      <template v-slot:no-data>
        <v-btn color="primary" @click="getContacts">Reset</v-btn>
      </template>
      <v-alert v-slot:no-results :value="true" color="error" icon="warning">
        Your search for "{{ search }}" found no results.
      </v-alert>
    </v-data-table>
  </div>
</template>

<script>
import axios from 'axios';
  export default {
    data: () => ({
      dialog: false,
      search: '',
      headers: [
        {
          text: 'Number (#)',
          align: 'left',
          sortable: false,
          value: 'id'
        },
        { text: 'Full Name', align: 'left', value: 'fullName' },
        { text: 'Phone', value: 'contact' },
        { text: 'Actions', value: 'name', sortable: false }
      ],
      contacts: [],
      editedIndex: -1,
      editedItem: {
        id: '',
        fullName: 0,
        contact: 0,
      },
      defaultItem: {
        id: '',
        fullName: 0,
        contact: 0,
      }
    }),

    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
      }
    },

    watch: {
      dialog (val) {
        val || this.close()
      }
    },

    created () {
      this.initialize()
    },

    methods: {
      postData(url,data,callback) {
        axios.post(url,data)
        .then((response) => {
          console.log('Sent POST data to ',url,response)
          callback(response)
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log('Error posting to ',error)
        })
      },
      putData(url,data,callback) {
        axios.put(url,data)
        .then((response) => {
          console.log('Sent PUT data to ',url,response)
          callback(response)
        })
        .catch((response) => {
          // eslint-disable-next-line
          console.log('Error PUTing data ',url,response)
        })
      },
      getData(url,callback) {
        axios.get(url)
        .then((response) => {
          // eslint-disable-next-line
          console.log(' Gotten data from ',response)
          callback(response)
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log('Error GETing data ',error)
        })
      },
      deleteData(url,callback) {
        axios.delete(url)
        .then((response) => {
          // eslint-disable-next-line
          console.log('From deleting item ',response)
          callback(response)
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log('Error while deleting item ',error)
          
        })
      },
      getContacts() {
        axios.get('/contacts')
        .then((response) => {
          // eslint-disable-next-line
          console.log(response);
          let gottenContacts = response.data.data;
          this.contacts = gottenContacts;
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log('All contacts Error', error);
        })
      },
      initialize () {
        let token = localStorage.getItem('token')
        if(token) {
          axios.defaults.headers.common['Authorization'] = "Bearer "+token;
        this.getContacts();
        }
        
      },

      editItem (item) {
        this.editedIndex = this.contacts.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },

      deleteItem (item) {
        // eslint-disable-next-line
        let url = '/contacts/'+item.id
        confirm('Are you sure you want to delete this item?') && this.deleteData(url,(response)=> {
          console.log('After deleting item')
          let here = this;
          let d = response.data
          if(response.status===200) {
            console.log('Deleted Item ',item,d)
            const index = here.contacts.indexOf(item)
            here.contacts.splice(index, 1)
          }
        })
        
        //confirm('Are you sure you want to delete this item?') && this.contacts.splice(index, 1)
      },

      close () {
        this.dialog = false
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        }, 300)
      },

      save () {
        if (this.editedIndex > -1) {
          // eslint-disable-next-line
          console.log('Edited Item ',this.contacts[this.editedIndex])
          let url = '/contacts/'+this.editedItem.id; 
          let data = {name:this.editedItem.fullName,phone: this.editedItem.contact};
          let here = this;
          let mId = this.editedIndex
          this.putData(url,data, (response) => {
            // eslint-disable-next-line
            let d = response.data.data
            
            if(response.status===200) {
              console.log('From editing the item ',response,d)
              here.editedItem.id = d.id
              here.editedItem.fullName = d.fullName
              here.editedItem.contact = d.contact
              console.log('First index',mId,'Edited Item Now ',here.editedItem, 'index ',mId,'all contacts ',here.contacts,'original index',here.contacts[mId])
              Object.assign(here.contacts[mId], here.editedItem)
            }
            
          })
          
        } else {
          let url = '/contacts';
          let data = {name: this.editedItem.fullName, phone: this.editedItem.contact};
          let here = this;
          this.postData(url,data, (response) => {
            // eslint-disable-next-line
            let d = response.data.data
            
            if(response.status===201) {
              console.log('From creating a new item ',response,d)
              //set the id
              here.editedItem.id = d.id
              here.editedItem.fullName = d.fullName
              here.editedItem.contact = d.contact
              // eslint-disable-next-line
              console.log('New Item created ',here.editedItem)
              here.contacts.push(here.editedItem)
            }
            
          })
        }
        this.close()
      }
    }
  }
</script>

<style>

</style>
