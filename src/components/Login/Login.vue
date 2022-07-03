<template>
  <v-container class="container-login">
    <v-col md="12" class="mt-12">
      <v-snackbar v-model="snackbar" top="top">
        {{ msg }}
        <template v-slot:action="{ attrs }">
          <v-btn color="red" text v-bind="attrs" @click="snackbar = false"
            >Close</v-btn
          >
        </template>
      </v-snackbar>
    </v-col>
    <v-col md="12" class="mt-12"> </v-col>

    <v-col md="12" class="mt-12">
      <v-card
        class="mx-auto card-login rounded-md"
        max-width="344"
        max-height="400"
        elevation="7"
      >
        <v-card-text>
          <form>
            <v-col md="12" class="mt-12">
              <v-text-field v-model="email" label="E-mail"></v-text-field>

              <v-text-field
                :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
                :type="showPass ? 'text' : 'password'"
                v-model="password"
                label="Senha *"
                hint="At least 8 characters"
                counter
                @click:append="showPass = !showPass"
              ></v-text-field>
              <v-row>
                <v-btn class="mr-4" @click="hendleLogin()">Login</v-btn>
                <v-spacer></v-spacer>
                <v-progress-circular
                  v-if="loading"
                  :size="30"
                  color="primary"
                  indeterminate
                ></v-progress-circular>
              </v-row>
            </v-col>
          </form>
        </v-card-text>
        <v-card-actions>
          <v-btn text color="deep-purple accent-4"> Cadastrar Usuário </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>

    <v-col md="12" class="mt-12"> </v-col>
  </v-container>
</template>
<style scoped>
.card-login {
  align-self: center;
  background-color: #c2c2c2;
}
.container-login {
  justify-content: center;
  align-items: center;
  flex: 1;
  height: 100%;
  width: 100%;
  background-color: #c2c2c2;
}
</style>

<script>
import constants from '../../util/constants'
import { mapActions, mapGetters } from "vuex";

export default {
  data: () => ({
    laoding: false,
    msg: constants.STRINGS.ERROR_MESSAGE_LOGIN,
    snackbar: false,
    email: "",
    password: "",
    showPass: false,
  }),

  computed: {
    ...mapGetters({
      errorPass: "Login/getErrorPass",
    }),
  },

  methods: {
    ...mapActions({
      login: "Login/login",
    }),
    initialize() {},

    async hendleLogin() {

      this.laoding = true;

      await this.login({ email: this.email, password: this.password });

      if (!this.errorPass) {
        
        this.$router.push("/dashboard");
        this.laoding = false;
        return

      } 

      console.log('ErrorPass: ', this.errorPass)
      this.snackbar = true;
      this.laoding = false;
      return

    },
  },
  created() {
    this.initialize();
  },
};
</script>