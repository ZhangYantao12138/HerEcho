import { defineStore } from 'pinia'
import { Script, ScriptState } from '../types/script'
import { scriptService } from '../services/scriptService'

export const useScriptStore = defineStore('script', {
    state: (): ScriptState => ({
        scripts: [],
        selectedScript: null,
        loading: false,
        error: null
    }),

    actions: {
        async fetchScripts() {
            this.loading = true
            try {
                const scripts = await scriptService.getScripts()
                this.scripts = scripts
                return scripts
            } catch (error) {
                this.error = error.message
                throw error
            } finally {
                this.loading = false
            }
        },

        async fetchScriptById(id: string) {
            this.loading = true
            try {
                const script = await scriptService.getScriptById(id)
                this.selectedScript = script
                return script
            } catch (error) {
                this.error = error.message
                throw error
            } finally {
                this.loading = false
            }
        },

        setSelectedScript(script: Script | null) {
            this.selectedScript = script
        }
    }
}) 