import React, { useState, useEffect } from "react";
import qs from 'query-string'

import * as Yup from "yup";
import { useHistory } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";
import { toast } from "react-toastify";
import { Formik, Form, Field } from "formik";
import usePlans from "../../hooks/usePlans";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import InputMask from 'react-input-mask';
import {
	FormControl,
	InputLabel,
	MenuItem,
	Select,
} from "@material-ui/core";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import logo from "../../assets/logo.png";
import { i18n } from "../../translate/i18n";
import imageLogin from "../../assets/imageLogin.png"

import { openApi } from "../../services/api";
import toastError from "../../errors/toastError";
import moment from "moment";
const Copyright = () => {
	return (
		<Typography variant="body2" color="textSecondary" align="center">
			{"Copyright © "}
			<Link color="inherit" href="#">
				PLW
			</Link>{" "}
		   {new Date().getFullYear()}
			{"."}
		</Typography>
	);
};

const useStyles = makeStyles(theme => ({
	root: {
		width: "100vw",
		height: "100vh",
		backgroundColor: "#fff",
		backgroundRepeat: "no-repeat",
		backgroundSize: "50% 50%",
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		textAlign: "center",
		position: "relative",	
	},
	paper: {
		backgroundColor: "#fff",
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		padding: "50px 30px",
		borderRadius: "12.5px",
	},
	avatar: {
		margin: theme.spacing(1),
		backgroundColor: theme.palette.secondary.main,
	},
	form: {
		width: "100%",
		marginTop: theme.spacing(1),
		
	},
	submit: {
		margin: theme.spacing(3, 0, 2),
	},
	powered: {
		color: "white"
	},

	imageLogin: {
		position: "right", 
		right: "0", 
		bottom: "0",
		height: "120%",
		display: "block",
		'@media (max-width: 1070px)': { // deixa responsivo  
			display: "none",
		},
		'@media (max-width: 1150px)': {
			width: "600px",
		}, 
	}
}));

const UserSchema = Yup.object().shape({
	name: Yup.string()
		.min(2, "Too Short!")
		.max(50, "Too Long!")
		.required("Required"),
	password: Yup.string().min(5, "Too Short!").max(50, "Too Long!"),
	email: Yup.string().email("Invalid email").required("Required"),
});

const SignUp = () => {
	const classes = useStyles();
	const history = useHistory();
	let companyId = null

	const params = qs.parse(window.location.search)
	if (params.companyId !== undefined) {
		companyId = params.companyId
	}

	const initialState = { name: "", email: "", phone: "", password: "", planId: "", };

	const [user] = useState(initialState);
	const dueDate = moment().add(3, "day").format();
	const handleSignUp = async values => {
		Object.assign(values, { recurrence: "MENSAL" });
		Object.assign(values, { dueDate: dueDate });
		Object.assign(values, { status: "t" });
		Object.assign(values, { campaignsEnabled: true });
		try {
			await openApi.post("/companies/cadastro", values);
			toast.success(i18n.t("signup.toasts.success"));
			history.push("/login");
		} catch (err) {
			console.log(err);
			toastError(err);
		}
	};

	const [plans, setPlans] = useState([]);
	const { list: listPlans } = usePlans();

	useEffect(() => {
		async function fetchData() {
			const list = await listPlans();
			setPlans(list);
		}
		fetchData();
	}, []);


	return (
		<div className={classes.root}>
		<Container component="main" maxWidth="xs">
			<CssBaseline />
			
			<div className={classes.paper}>
				<div>
					<center><img style={{ margin: "0 auto", width: "110%" }} src={logo} alt="zapcomm" /></center>
				</div>
				{/*<Typography component="h1" variant="h5">
					{i18n.t("signup.title")}
				</Typography>*/}
				{/* <form className={classes.form} noValidate onSubmit={handleSignUp}> */}
				
				<Formik
					initialValues={user}
					enableReinitialize={true}
					validationSchema={UserSchema}
					onSubmit={(values, actions) => {
						setTimeout(() => {
							handleSignUp(values);
							actions.setSubmitting(false);
						}, 400);
					}}
				>
					{({ touched, errors, isSubmitting }) => (
						<Form className={classes.form}>
							<Grid container spacing={2}>
								<Grid item xs={12}>
									<Field
										as={TextField}
										autoComplete="name"
										name="name"
										error={touched.name && Boolean(errors.name)}
										helperText={touched.name && errors.name}
										variant="outlined"
										fullWidth
										id="name"
										label="Nome da Empresa"
										size="small"
									/>
								</Grid>

								<Grid item xs={12}>
									<Field
										as={TextField}
										variant="outlined"
										fullWidth
										id="email"
										label={i18n.t("signup.form.email")}
										size="small"
										name="email"
										error={touched.email && Boolean(errors.email)}
										helperText={touched.email && errors.email}
										autoComplete="email"
										required
									/>
								</Grid>
								
							<Grid item xs={12}>
								<Field
									as={InputMask}
									mask="(99) 99999-9999"
									variant="outlined"
									fullWidth
									id="phone"
									name="phone"
									error={touched.phone && Boolean(errors.phone)}
									helperText={touched.phone && errors.phone}
									autoComplete="phone"
									required
								>
									{({ field }) => (
										<TextField
											{...field}
											variant="outlined"
											fullWidth
											label="Telefone com (DDD)"
											size="small"
											inputProps={{ maxLength: 11 }} // Definindo o limite de caracteres
										/>
									)}
								</Field>
							</Grid>
								<Grid item xs={12}>
									<Field
										as={TextField}
										variant="outlined"
										fullWidth
										name="password"
										error={touched.password && Boolean(errors.password)}
										helperText={touched.password && errors.password}
										label={i18n.t("signup.form.password")}
										size="small"
										type="password"
										id="password"
										autoComplete="current-password"
										required
									/>
								</Grid>
							</Grid>
							<Button
								type="submit"
								fullWidth
								variant="contained"
								className={classes.submit}
								color="primary"
								style={{backgroundColor: "#0C2454"}}
								// coloca a cor no botao  
							>
								{i18n.t("signup.buttons.submit")}
							</Button>
							<Grid container justify="flex-end">
								<Grid item>
									<Link
										href="#"
										variant="body2"
										component={RouterLink}
										to="/login"
									>
										{i18n.t("signup.buttons.login")}
									</Link>
								</Grid>
							</Grid>
						</Form>
					)}
				</Formik>
			</div>
			<Box mt={5}>{/* <Copyright /> */}</Box>
		</Container>
			<img className={classes.imageLogin} src={imageLogin} alt="imagem na tela login" />
		</div>
		
	);
};

export default SignUp;
