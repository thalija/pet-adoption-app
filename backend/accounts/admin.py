from django.contrib import admin
from .models import Profile


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    '''
    Where the Admin can view/edit a profile in Django's dashboard.
    '''
    # What admin sees on profile page.
    list_display = ("user", "role", "children", "activity")
    # filter on right side of page.
    list_filter = ("role",)
    # find a profile by the username or email.
    search_fields = ("user__username", "user__email")

    # admin can view a User but cannot changer the user to another user.
    readonly_fields = ("user",)

    # what appears on the edit page.
    fields = ("user", "role", "children", "activity")

    def has_add_permission(self, request):
        '''
        Disable manual profile creation using Django Admin
        A profile is created when a user is created
        '''
        return False

    def has_delete_permission(self, request, obj=None):
        '''
        Prevent deletion of profiles, every User needs a profile.
        If a profile is deleted, the user will still exist and 
        cause possible crashes or bugs.
        '''
        return False
