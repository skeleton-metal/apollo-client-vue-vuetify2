<template>

    <v-card>
        <v-card-title class="secondary--text" v-t="'user.changePassword'"></v-card-title>


        <v-card-text>
            <v-form ref="form" autocomplete="off" v-model="valid" @submit.prevent="submit">
                <v-text-field id="password"
                              prepend-icon="lock"
                              name="password"
                              label="Nueva Contraseña"
                              type="password"
                              v-model="form.password"
                              :rules="validations.password"
                              placeholder="Nueva Contraseña"
                              autocomplete="new-password"
                              :error="errors.password.length?true:false"
                              :error-messages="errors.password"
                              required
                />

                <v-text-field id="password_verify"
                              prepend-icon="lock"
                              name="password_verify"
                              label="Repetir Nueva Contraseña"
                              type="password"
                              v-model="form.passwordVerify"
                              :rules="validations.password"
                              placeholder="Repetir Nueva Contraseña"
                              autocomplete="new-password"
                              :error="errors.passwordVerify.length?true:false"
                              :error-messages="passwordMatchError"
                              required
                />
            </v-form>
        </v-card-text>

        <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn outlined color="grey" text @click="$emit('closeDialog')">
                Cancelar
            </v-btn>

            <v-btn  :loading="loading" color="secondary" @click="submit" :disabled="!valid">
                Cambiar Contraseña
            </v-btn>

        </v-card-actions>

    </v-card>

</template>

<script>
    import {mapGetters, mapActions, mapState} from 'vuex'

    export default {
        name: "UserChangePassword",
        props: {
          user: Object
        },
        data: () => ({
                valid: true,
                form: {
                    id: null,
                    password: null,
                    passwordVerify: null,
                },
                errors: {
                    password: [],
                    passwordVerify: []
                },
                validations: {
                    password: [
                        v => !!v || 'Contraseña es requerido',
                    ],
                    passwordVerify: [
                        v => !!v || 'Verificación de contraseña es requerido',
                    ],
                }
            }
        ),
        computed: {
            ...mapGetters([
                'me',
                'getUsersLoading',
                'getChangePassword'
            ]),
            ...mapState({
                loading: s => s.profile.loadingUserProfile,
                status: s => s.profile.changePasswordStatus
            }),
            passwordMatchError() {
                return (this.form.password === this.form.passwordVerify) ? '' : 'Contraseña no coincide'
            },
        },
        methods: {
            ...mapActions(['adminChangePassword']),

            resetValidation: function () {
                this.errors = {
                    password: [],
                    passwordVerify: []
                }
            },
            submit() {
                if (this.$refs.form.validate()) {

                    this.resetValidation()
                    this.form.id = this.user.id || null
                    this.adminChangePassword(this.form).then(r => {
                            if (r) {
                                this.$emit('closeDialog')
                            }
                        }
                    )
                }
            },
        }
    }
</script>

<style scoped>

</style>
