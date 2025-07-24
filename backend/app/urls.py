
"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, re_path, include
from django.views.generic import TemplateView
from django.conf.urls.static import static
from django.conf import settings
from . import views


urlpatterns = [
    path('login/', views.LoginView.as_view(), name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('password_reset/', include('django_rest_passwordreset.urls', namespace='password_reset')),
    path('change_password/', views.change_password, name='change_password'),
    path('department_tasks/', views.get_department_tasks, name='department_tasks'),
    path('getdeptbyid/', views.get_dept_by_id, name='getdeptbyid'),
    #path('createpass/', views.create_passwords, name = 'create_passwords'),
    path('validatepass/', views.validate_pass, name='validate_pass'),
    path('getuserbuid/', views.get_user_by_id, name='getuserbyid'),
    path('changetaskstatus/', views.change_task_status, name='changetaskstatus'),
    path('changetaskpriority/', views.change_task_priority, name='changetaskpriority'),
    path('gettaskbyid/', views.get_task_by_id, name='gettaskbyid'),
    path('getteambydept/', views.get_team_by_dept, name='get_team_by_dept'),
    path('getprogressreports/', views.get_progress_reports, name='get_progress_reports'),
    path('deletetask/', views.delete_task, name='deletetask'),
    path('assigntasks/', views.assign_tasks, name='assigntasks'),
    path('yourtasks/', views.your_tasks, name='your_tasks'),
    path('getusersbydept/', views.get_users_by_dept, name='getuserbydept'),
    path('newtask/', views.new_tasks, name="newtask"),
    path('signup/', views.signup, name="signup"),
    path('bootcampreg/', views.bootcampregisteration, name="bootcampregisteration"),
    path('createprogressreport/', views.create_progress_report, name="create progress report"),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
