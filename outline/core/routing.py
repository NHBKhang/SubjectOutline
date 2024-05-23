class ModelRouter:
    def db_for_read(self, model, **hints):
        if model._meta.app_label == 'core':
            return 'default'
        elif model._meta.app_label == 'mail':
            return 'mongo'
        elif model._meta.app_label == 'temp':
            return 'sqlite'
        return None

    def db_for_write(self, model, **hints):
        if model._meta.app_label == 'core':
            return 'default'
        elif model._meta.app_label == 'mail':
            return 'mongo'
        elif model._meta.app_label == 'temp':
            return 'sqlite'
        return None

    def allow_relation(self, obj1, obj2, **hints):
        # if obj1._meta.app_label == obj2._meta.app_label:
        #     return True
        return None

    def allow_migrate(self, db, app_label, model_name=None, **hints):
        return None
