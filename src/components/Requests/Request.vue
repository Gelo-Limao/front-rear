<template>
  <v-card>
    <v-card-title>
      Pedidos
      <v-icon id="titleIcon">{{ icons.icon }}</v-icon>

      <v-snackbar v-model="snackbar" top="top">
        {{ msg }}
        <template v-slot:action="{ attrs }">
          <v-btn color="red" text v-bind="attrs" @click="snackbar = false"
            >Close</v-btn
          >
        </template>
      </v-snackbar>
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Consulte os pedidos por Cliente..."
      ></v-text-field>
    </v-card-title>

    <v-tabs horizontal>
      <v-tab left>
        <v-icon left>{{ icons.icon }}</v-icon
        >Dados dos Pedidos
      </v-tab>

      <v-tab-item>
        <v-card flat>
          <v-data-table
            :headers="headers"
            :items="users"
            sort-by="name"
            class="elevation-4"
          >
            <template v-slot:top>
              <v-dialog v-model="dialogEdit" max-width="70%">
                <v-card>
                  <v-card-title>
                    <span class="headline">{{ formTitle }}</span>
                    <v-icon id="titleIcon">{{ icons.iconAdd }}</v-icon>
                  </v-card-title>

                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field
                            v-model="editedItem.name"
                            label="Numero do Pedido"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field
                            v-model="editedItem.email"
                            label="Produtos"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field
                            v-model="editedItem.email"
                            label="Valor do Pedido"
                          ></v-text-field>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn class="ma-2" color="primary" text @click="save" dark>
                      Salvar
                      <v-icon dark right>mdi-checkbox-marked-circle</v-icon>
                    </v-btn>

                    <v-btn class="ma-2" color="red" text @click="close" dark>
                      Cancelar
                      <v-icon dark right>mdi-cancel</v-icon>
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </template>
            <template v-slot:item.actions="{ item }">
              <v-icon small class="mr-2" @click="editItem(item)">
                mdi-pencil
              </v-icon>
              <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
            </template>
          </v-data-table>
        </v-card>
      </v-tab-item>
    </v-tabs>

    <!-- modal -->

    <v-row justify="center">
      <v-dialog v-model="dialog" persistent max-width="80%">
        <template v-slot:activator="{ on }">
          <div class="my-2">
            <v-btn color="info" id="add" v-on="on" fab>
              <v-icon>{{ icons.iconAdd }}</v-icon>
            </v-btn>
          </div>
        </template>
        <v-card>
          <v-card-title>
            <span class="headline">Novo Pedido</span>
            <v-icon id="titleIcon">{{ icons.iconAdd }}</v-icon>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="newUser.name"
                    label="Numero do Pedido"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="newUser.email"
                    label="Cliente *"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
            <small>* Preenchimento obrigatório</small>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              class="ma-2"
              color="primary"
              text
              @click="hendleSubmit()"
              dark
            >
              Salvar
              <v-icon dark right>mdi-checkbox-marked-circle</v-icon>
            </v-btn>

            <v-btn class="ma-2" color="red" text @click="dialog = false" dark>
              Cancelar
              <v-icon dark right>mdi-cancel</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>

    <!-- modal -->
  </v-card>
</template>
<style scoped>
#add {
  z-index: 2;
  margin-top: -40px;
  margin-left: 20px;
  float: left;
}
</style>

<script>
import { mapActions, mapGetters } from "vuex";
import { mdiCubeSend } from "@mdi/js";

export default {
  data: () => ({
    formTitle: "Editar Pedido",
    snackbar: false,
    search: "",
    msg: "",
    showPass: false,
    dialogEdit: false,
    password: "",
    rules: {
      required: (value) => !!value || "Required.",
      min: (v) => v.length >= 8 || "Min 8 characters",
    },
    firsstName: "",
    secondName: "",
    name: "",
    email: "",
    dialog: false,
    headers: [
      { text: "Número do Pedido", value: "requestNumber" },
      { text: "Cliente", value: "client" },
      { text: "Status", value: "status" },
      { text: "Valor", value: "value" },
      { text: "Ações", value: "actions", sortable: false },
    ],
    defaultItem: {},
    editedItem: {},
    editedIndex: -1,
    newUser: {},
    users: [],
    icons: {
      icon: mdiCubeSend,
      iconAdd: mdiCubeSend,
    },
  }),

  computed: {
    ...mapGetters({
      error: "User/getError",
      dataTable: "User/getUser",
    }),
    formTitle() {
      return this.editedIndex === -1 ? "New Item" : "Edit Item";
    },
  },

  watch: {
    dialogEdit(val) {
      val || this.close();
    },
  },

  async created() {
    await this.initialize();
  },

  methods: {
    ...mapActions({
      getUser: "User/getUser",
      createUser: "User/createUser",
      deleteUser: "User/deleteUser",
    }),
    async initialize() {
      await this.getUser({
        page: 1,
        noLimit: true,
      });
      this.users = this.dataTable;
      console.log("datatable: ", this.dataTable);
    },

    async hendleSubmit() {
      await this.createUser(this.newUser);
      if (!this.error) {
        await this.initialize();
        this.dialog = false;
        this.msg = "Usuário cadastrado com sucesso!";
        this.snackbar = true;
      } else {
        await this.initialize();
        this.dialog = false;
        this.msg = "Usuário já cadastrado!";
        this.snackbar = true;
      }
    },

    async deleteItem(item) {
      await this.deleteUser(item._id);
      if (!this.error) await this.initialize();
      this.msg = "Usuário detelado!";
      this.snackbar = true;
    },

    editItem(item) {
      this.editedIndex = this.users.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogEdit = true;
    },

    close() {
      this.dialogEdit = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.users[this.editedIndex], this.editedItem);
      } else {
        this.users.push(this.editedItem);
      }
      this.close();
    },
  },
};
</script>