from django.test import TestCase
from django.contrib.auth.models import User
from django.urls import reverse
from .models import Profile

# Create your tests here.
class AdminProfileTests(TestCase):
    """
    Tests for the Django Admin based off of admin.py
    
    Tests consist of:
    - Admin can view the profile list page and profile edit page.
    - Admin restrictions (no adding, no deleting, and read only enabled on roles)
    - Admin search and filters work as expected
    - Non-admins cannot acces the admin pages

    How to run:
    - open terminal 
    - go to backend directory: 
        cd backend
    - enter in terminal to run test: 
        python manage.py test accounts

    """
    def setUp(self):
        # create a test user
        self.admin = User.objects.create_superuser(
            username= "admin_test",
            email= "admin_test@email.com",
            password= "admintest1234",
        )
        self.client.login(username= "admin_test", password= "admintest1234")

    def test_profile_page(self):
        """
        Admin logs in and is able to load the profile list page without errors.
        """
        response = self.client.get("/admin/accounts/profile/")
        self.assertEqual(response.status_code, 200)

    def test_logout_behavior(self):
        """
        User is redirected to admin login page when trying to access 
        admin page when logged out.
        Expected outcome: Request is redirected (302)
        """
        self.client.logout()
        url = "/admin/accounts/profile/"
        response = self.client.get(url)
        # 302 - redirect
        self.assertEqual(response.status_code, 302)

    def test_display_columns(self):
        """
        Admin display list contains the appropriate columns.
        Expected outcome: Columns should appear on the page User, Role, Children, Activity.
        """
        response = self.client.get("/admin/accounts/profile/")
        self.assertEqual(response.status_code, 200)

        # list the columns User, Role, Children, Activity.
        self.assertContains(response, "user")
        self.assertContains(response, "role")
        self.assertContains(response, "children")
        self.assertContains(response, "activity")

    def test_profile_add(self):
        """
        Admin should not be able to add a profile 
        Expected outcome: Request is blocked (403)
        """
        url = reverse("admin:accounts_profile_add")
        response = self.client.get(url)
        # 403 - forbidden
        self.assertEqual(response.status_code, 403)

    def test_profile_delete(self):
        """
        Admin should not be able to delete a profile
        Expected outcome: Request is blocked (403)
        """
        # create a public user with no admin powers
        user = User.objects.create_user(
            username= "example_user",
            email= "example_user@email.com",
            password= "example_user1234",
        )
        # profile for the user
        user_profile = user.profile

        url = reverse("admin:accounts_profile_delete", args=[user_profile.id])
        response = self.client.get(url)
        # 403 - forbidden
        self.assertEqual(response.status_code, 403)

    def test_readonly_userfield(self):
        """
        Admin is able to view profile change page, but user field is read only
        Expected outcome: page loads and user field cannot be edited
        """
        # create a public user with no admin powers
        user = User.objects.create_user(
            username= "example_user",
            email= "example_user@email.com",
            password= "example_user1234",
        )
        # profile for the user
        user_profile = user.profile

        url = reverse("admin:accounts_profile_change", args=[user_profile.id])
        response = self.client.get(url)
        # 200 - success
        self.assertEqual(response.status_code, 200)
        # user field is not editable
        self.assertNotContains(response, 'name="user"')

    def test_search_by_username(self):
        """
        Admin is able to search a profile by username.
        Expected outcome: Returns searched profile successfully
        """
        # create a public user with no admin powers
        user1 = User.objects.create_user(
            username= "search_test",
            email= "search_test@email.com",
            password= "search_test1234",
        )
        user2 = User.objects.create_user(
            username= "exmple_test",
            email= "exmple_test@email.com",
            password= "exmple_test1234",
        )
        # q is the query paramaters used by Django
        response = self.client.get("/admin/accounts/profile/", {"q": "search_test"} )
           
        # 200 - success
        self.assertEqual(response.status_code, 200)
        # matching username appears in search result
        self.assertContains(response,  "search_test")
        # other user name should not appear in search result
        self.assertNotContains(response, "exmple_test")

    def test_search_by_email(self):
        """
        Admin is able to search a profile by email.
        Expected outcome: Returns searched profile successfully
        """
        # create a public user with no admin powers
        user1 = User.objects.create_user(
            username= "email_test",
            email= "email_test@email.com",
            password= "email_test1234",
        )
        user2 = User.objects.create_user(
            username= "wrong_email",
            email= "wrong_email@email.com",
            password= "wrong_email1234",
        )
        # q is the query paramaters used by Django
        response = self.client.get("/admin/accounts/profile/", {"q": "email_test@email.com"} )

        # 200 - success
        self.assertEqual(response.status_code, 200)
        # matching username appears in search result
        self.assertContains(response,  "email_test@email.com")
        # other user name should not appear in search result
        self.assertNotContains(response, "wrong_email@email.com")

    def test_filter(self):
        """
        Admin is able to filter profiles by role.
        Expected outcome: Returns profiles with selected role
        """
        # create a public user with no admin powers
        user1 = User.objects.create_user(
            username= "role_example",
            email= "role_example@email.com",
            password= "role_example1234",
        )
        # create an admin user
        user2 = User.objects.create_user(
            username= "admin_example",
            email= "admin_example@email.com",
            password= "admin_example1234",
        )

        user2.profile.role = "admin"
        user2.profile.save()

        # role filter set for USER
        response = self.client.get("/admin/accounts/profile/", {"role__exact": "user"} )

        # 200 - success
        self.assertEqual(response.status_code, 200)
        # matching username appears in search result
        self.assertContains(response,  "role_example")
        # other user name should not appear in search result
        self.assertNotContains(response, "admin_example")

    def test_normal_user_login(self):
        """
        Non-admin user cannot access the admin pages and is redirected.
        Expected outcome: redirected (302)
        """
        # logout of superuser
        self.client.logout()

        # log in as a non admin user.
        non_admin = User.objects.create_user(
            username="non_admin",
            email="non_admin@email.com",
            password="non_admin123456",
        )
        # log on
        self.client.login(
            username="non_admin",
            password="non_admin123456",
            )
        # go to admin profile page
        response = self.client.get("/admin/accounts/profile/")
        # 302 - redirect
        self.assertEqual(response.status_code, 302)

    def test_normal_user_access(self):
        """
        Non-admin user cannot access the admin edit page and is redirected.
        Expected outcome: redirected (302)
        """
        # logout of superuser
        self.client.logout()

        # log in as a non admin user.
        non_admin = User.objects.create_user(
            username="non_admin2",
            email="non_admin2@email.com",
            password="non_admin2123456",
        )
        # log on
        self.client.login(
            username="non_admin2",
            password="non_admin2123456",
            )
        # user profile
        profile = non_admin.profile
        # go to admin edit page
        url = reverse("admin:accounts_profile_change", args=[profile.id])
        response = self.client.get(url)
        # 302 - redirect
        self.assertEqual(response.status_code, 302)
