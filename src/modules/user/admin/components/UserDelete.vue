<template>
    <v-card>

        <v-toolbar flat dark color="primary">
            <v-toolbar-title>{{title}}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
                <v-btn icon dark @click="$emit('closeDialog')">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-toolbar-items>
        </v-toolbar>

        <v-card-text>
        <user-show-data :item="user" />
        </v-card-text>

        <v-card-text>
            <v-alert v-if="errorMessage" type="error" dense text>{{errorMessage}}</v-alert>
        </v-card-text>

        <v-card-text>
            <v-row justify="center">
                <span class="title">{{areYouSure}}</span>
            </v-row>
        </v-card-text>


        <v-card-actions>
            <v-btn color="grey" tile outlined @click="$emit('closeDialog')">
                Cerrar
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="remove" :loading="loading">
                Confirmar
            </v-btn>
        </v-card-actions>

    </v-card>
</template>

<script>
    import {mapActions} from 'vuex'
    import UserShowData from "./UserShowData";

    export default {
        name: "UserDelete",
        components: {UserShowData},
        props: {
            user: Object
        },
        data() {
            return {
                modal: false,
                title: "Borrando usuario",
                areYouSure: "¿Esta seguro que desea borrar este registro?",
                errorMessage: '',
                loading: false,
            }
        },
        methods: {
            ...mapActions(['deleteUser']),
            remove() {
                this.deleteUser(this.user.id).then( () => {
                    this.$emit('deleteConfirmed')
                    this.$emit('closeDialog')
                }).catch(err =>{
                    this.errorMessage = err.message
                })
            },
        },
    }
</script>

<style scoped>

</style>

