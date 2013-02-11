<?
	class userController extends CI_Controller{

		function index()
		{
			$data['content'] = 'loginView';
			$this->load->view('templates/template', $data);	
		}

		function login(){

				$this->load->model('membership_model');
		$query = $this->membership_model->validate();

		if($query) // if the user's credentials validated...
		{
			$data = array(
				'uname' => $this->input->post('uname'),
				'is_logged_in' => true
			);				
/* 			echo("hello user"); */

							$this->load->view('members_area');

/* 			redirect('site/members_area'); */
		}
/* 			redirect('site/members_area'); */

			else // incorrect username or password
			{
			$this->index();	


			}


		}
		function register(){

			//delted data aray from this funciton and the one above

			$data['content'] = 'registerView';
			$this->load->view('templates/template', $data);


		}
		function create_member()
	{
	$this->load->library('form_validation');

		// field name, error message, validation rules
		$this->form_validation->set_rules('name', 'Name', 'required');
		$this->form_validation->set_rules('user_email', 'Email Address', 'required|valid_email');
		$this->form_validation->set_rules('user_pass', 'Password', 'trim|required|md5');


		if($this->form_validation->run() == FALSE)
		{

		}

		else
		{	

			$this->load->model('Membership_model');

			if($query = $this->Membership_model->register())
			{
				$data['content'] = 'successView';
				$this->load->view('templates/template', $data);
			}
			else
			{	echo "you suck";
				$this->load->view('registerView');

			}//end of query else
		}


	}//end of create_member
	function logout()
	{
		$this->session->sess_destroy();
		$this->index();
	}



	}
?>